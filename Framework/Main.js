class Main
{
	constructor()
	{
		this.gfx = new Graphics()
		this.mouse = new Mouse( this.gfx )
		this.kbd = new Keyboard( this.gfx )
		
		this.textDrawer = new TextDrawer()
		
		this.nounList = new NounList()
		this.adjList = new AdjectiveList()
		
		this.menu = 0 // 0 = main menu, 1 = canvas
		
		this.buttons = [
			new ImageButton( 0,0,new Sprite( "Images/DailyButton.png" ),true ),
			new ImageButton( 0,0,new Sprite( "Images/RandomButton.png" ),true )
		]
		
		this.nekoCanv = null
		this.mouse.SetMain( this )
		this.gfx.SetMain( this )
		
		this.requiresUpdate = true
		
		this.titleImg = new Sprite( "Images/Title.png" )
		this.backButton = new ImageButton( 0,0,new Sprite( "Images/BackButton.png" ) )
		this.confirmLeaveButton = new ImageButton( 0,0,new Sprite( "Images/ConfirmLeaveButton.png" ),true )
		this.leaveTest = false
		this.yesButton = new ImageButton( 0,0,new Sprite( "Images/YesButton.png" ),true )
		this.noButton = new ImageButton( 0,0,new Sprite( "Images/NoButton.png" ),true )
		this.confirmDownloadButton = new ImageButton( 0,0,new Sprite( "Images/DownloadImageButton.png" ),true )
		this.downloadTest = false
		this.freezeMouse = false
		
		this.gfx.UpdateCanvSize( this.gfx )
	}
	
	Update( dt )
	{
		switch( this.menu )
		{
			case 0: // menu
				for( let i = 0; i < this.buttons.length; ++i )
				{
					if( this.buttons[i].Update( this.mouse ) )
					{
						this.GenerateCanv( i )
						this.menu = 1
						this.FreezeCanvMouse( true )
						break
					}
				}
				break
			case 1: // canvas
				if( this.leaveTest )
				{
					if( this.yesButton.Update( this.mouse ) )
					{
						this.menu = 0
						this.leaveTest = false
					}
					if( this.noButton.Update( this.mouse ) ) this.leaveTest = false
				}
				else if( this.downloadTest )
				{
					if( this.yesButton.Update( this.mouse ) )
					{
						this.nekoCanv.DownloadImage()
						this.downloadTest = false
					}
					if( this.noButton.Update( this.mouse ) ) this.downloadTest = false
				}
				else if( this.freezeMouse )
				{
					if( !this.mouse.down ) this.FreezeCanvMouse( false )
				}
				else
				{
					if( this.nekoCanv.Update( this.mouse,this.kbd ) )
					{
						this.downloadTest = true
						this.FreezeCanvMouse( true )
					}
					
					if( this.backButton.Update( this.mouse ) )
					{
						this.leaveTest = true
						this.FreezeCanvMouse( true )
					}
				}
				break
		}
	}
	
	Draw()
	{
		switch( this.menu )
		{
			case 0: // menu
				this.titleImg.DrawCentered( this.gfx.width / 2,this.gfx.height * 0.2,
					this.gfx,false,Math.max( this.gfx.width * 0.006,this.gfx.height * 0.008 ) )
				for( const button of this.buttons ) button.Draw( this.gfx )
				break
			case 1: // canvas
				// this.titleImg.DrawCentered( this.gfx.width / 2,this.gfx.height * 0.06,
				// 	this.gfx,false,this.gfx.width * 0.003 )
				this.nekoCanv.Draw( this.gfx,this.textDrawer )
				this.backButton.Draw( this.gfx )
				
				if( this.leaveTest )
				{
					this.confirmLeaveButton.Draw( this.gfx )
					this.yesButton.Draw( this.gfx )
					this.noButton.Draw( this.gfx )
				}
				else if( this.downloadTest )
				{
					this.confirmDownloadButton.Draw( this.gfx )
					this.yesButton.Draw( this.gfx )
					this.noButton.Draw( this.gfx )
				}
				break
		}
		
		const rectSize = 5
		const drawPos = new Vec2( this.mouse.x,this.mouse.y ).Subtract( Vec2.One().Scale( rectSize / 2 ) )
		this.gfx.DrawRect( drawPos.x,drawPos.y,rectSize,rectSize,"red" )
	}
	
	RequestUpdate()
	{
		this.requiresUpdate = true
	}
	
	OnResize( self )
	{
		const buttonScale = Math.max( this.gfx.width * 0.004,this.gfx.height * 0.008 )
		
		self.buttons[0].MoveTo( self.gfx.width * 0.5,self.gfx.height * 0.45 )
		self.buttons[1].MoveTo( self.gfx.width * 0.5,self.gfx.height * 0.7 )
		
		for( const button of self.buttons ) button.UpdateScale( buttonScale )
		
		this.confirmLeaveButton.MoveTo( self.gfx.width / 2,self.gfx.height / 2 )
		this.yesButton.MoveTo( self.gfx.width * 0.4,self.gfx.height * 0.7 )
		this.noButton.MoveTo( self.gfx.width * 0.6,self.gfx.height * 0.7 )
		this.confirmDownloadButton.MoveTo( self.gfx.width / 2,self.gfx.height / 2 )
		
		this.confirmLeaveButton.UpdateScale( buttonScale )
		this.yesButton.UpdateScale( buttonScale )
		this.noButton.UpdateScale( buttonScale )
		this.confirmDownloadButton.UpdateScale( buttonScale )
		
		this.backButton.UpdateScale( buttonScale )
	}
	
	GenerateCanv( type )
	{
		const colors = []
		let prompt = ""
		
		if( type == 0 ) // daily
		{
			const now = new Date()
			const seed = now.getFullYear() + now.getMonth() * 32 + now.getDate()
			const prng = new PseudoRandom( seed )
			const nCols = prng.NextInt( 1,10 )
			for( let i = 0; i < nCols; ++i ) colors.push( prng.RandColor() )
			
			prompt = this.adjList.GetSeededItem( prng ) + " " + this.nounList.GetSeededItem( prng )
		}
		else // random
		{
			const nCols = NekoUtils.RandInt( 1,10 )
			for( let i = 0; i < nCols; ++i ) colors.push( NekoUtils.RandColor() )
			
			prompt = this.adjList.GetRandItem() + " " + this.nounList.GetRandItem()
		}
		
		this.nekoCanv = new NekoCanv( colors,prompt )
		this.mouse.SetNekoCanv( this.nekoCanv )
		this.gfx.SetNekoCanv( this.nekoCanv )
	}
	
	FreezeCanvMouse( frozen )
	{
		this.freezeMouse = frozen
		this.nekoCanv.ToggleFreezeMouse( frozen )
	}
}

const delay = 1000.0 / 60.0
const main = new Main()
let prevTime = Date.now()
setInterval( function()
{
	const now = Date.now()
	const dt = ( now - prevTime ) / 30
	prevTime = now
	
	main.Update( dt )
	
	if( main.requiresUpdate ) // only redraw if absolutely necessary
	{
		main.gfx.DrawRect( 0,0,main.gfx.width,main.gfx.height,"#393635" )
		main.Draw()
		
		main.requiresUpdate = false
	}
},delay )