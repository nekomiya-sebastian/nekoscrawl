class NekoCanv
{
	constructor( colors,prompt )
	{
		this.prompt = prompt
		
		this.canvPos = Vec2.Zero()
		this.canvSize = new Vec2( 200,200 ) // 200,200
		
		this.canv = document.getElementById( "drawcanv" )
		this.canv.width = this.canvSize.x
		this.canv.height = this.canvSize.y
		
		this.ctx = this.canv.getContext( "2d" )
		this.ctx.imageSmoothingEnabled = false
		this.ctx.mozImageSmoothingEnabled = false
		
		this.canvScale = 1
		
		this.bgCol = "white"
		this.FillRect( 0,0,this.canvSize.x,this.canvSize.y,this.bgCol )
		
		this.prevMousePos = new Vec2( -1,-1 )
		
		this.iconSize = 1
		
		this.toolSprs = [
			new Sprite( "Images/Brush.png" ),
			new Sprite( "Images/Eraser.png" ),
			
			new Sprite( "Images/DownloadIcon.png" ) // last
		]
		this.toolDownloadInd = this.toolSprs.length - 1
		this.toolSprSize = 12
		this.toolHitboxes = []
		this.toolInd = 0
		this.toolFuncs = [
			this.BrushFunc,
			this.EraserFunc,
			
			null // download (last)
		]
		NekoUtils.Assert( this.toolSprs.length == this.toolFuncs.length,"Tool spr & func count mismatch!" )
		this.toolSelectorSpr = new Sprite( "Images/ToolSelector.png" )
		
		this.colors = colors
		this.colorHitboxes = []
		this.colorInd = 0
		this.colorSelectorSpr = new Sprite( "Images/ColorSelector.png" )
		
		this.sizeSprs = Anim.GenSprArr( "Images/BrushSize",6 )
		this.sizes = [
			1, // single pixel
			2,
			3,
			7,
			15,
			25
		]
		this.pixelSquareInd = 0
		NekoUtils.Assert( this.sizeSprs.length == this.sizes.length,"Size sprite count mismatch!" )
		this.sizeHitboxes = []
		this.sizeInd = 3
		
		this.canClick = true
		this.startClickOnCanvas = false
		this.prevMouseDown = false
	}
	
	Update( mouse,kbd )
	{
		// keybinds
		// 1-9 = colors
		// something to change brushes
		// [ ] to change brush size
		
		if( mouse.down )
		{
			if( this.canClick )
			{
				for( let i = 0; i < this.toolHitboxes.length; ++i )
				{
					if( this.toolHitboxes[i].Contains( mouse.x,mouse.y ) )
					{
						if( i == this.toolDownloadInd )
						{
							this.DownloadImage()
						}
						else this.toolInd = i
						
						break
					}
				}
				
				for( let i = 0; i < this.colorHitboxes.length; ++i )
				{
					if( this.colorHitboxes[i].Contains( mouse.x,mouse.y ) )
					{
						this.colorInd = i
						break
					}
				}
				
				for( let i = 0; i < this.sizeHitboxes.length; ++i )
				{
					if( this.sizeHitboxes[i].Contains( mouse.x,mouse.y ) )
					{
						this.sizeInd = i
						break
					}
				}
			}
			
			this.canClick = false
		}
		else this.canClick = true
	}
	
	Draw( gfx,textDrawer )
	{
		textDrawer.DrawText( this.prompt,new Vec2(
			gfx.width * 0.5,this.canvScale * 0.1 ),
			gfx,true,false,this.canvScale * 5 )
		
		gfx.context.drawImage( this.canv,this.canvPos.x,this.canvPos.y,
			this.canvSize.x * this.canvScale,this.canvSize.y * this.canvScale )
		
		for( let i = 0; i < this.toolHitboxes.length; ++i )
		{
			const curHitbox = this.toolHitboxes[i]
			if( i == this.toolInd )
			{
				this.toolSelectorSpr.Draw( curHitbox.x,curHitbox.y,gfx,
					false,this.iconSize / this.toolSprSize )
			}
			this.toolSprs[i].Draw( curHitbox.x,curHitbox.y,gfx,false,this.iconSize / this.toolSprSize )
		}
		
		for( let i = 0; i < this.colorHitboxes.length; ++i )
		{
			const curHitbox = this.colorHitboxes[i]
			curHitbox.Draw( gfx,this.colors[i] )
			if( i == this.colorInd )
			{
				this.colorSelectorSpr.Draw( curHitbox.x,curHitbox.y,gfx,
					false,this.iconSize / this.toolSprSize )
			}
		}
		
		for( let i = 0; i < this.sizeHitboxes.length; ++i )
		{
			const curHitbox = this.sizeHitboxes[i]
			if( i == this.sizeInd )
			{
				this.toolSelectorSpr.Draw( curHitbox.x,curHitbox.y,gfx,
					false,this.iconSize / this.toolSprSize )
			}
			this.sizeSprs[i].Draw( curHitbox.x,curHitbox.y,gfx,false,this.iconSize / this.toolSprSize )
		}
	}
	
	BrushFunc( x,y,self )
	{
		const brushSize = self.GetBrushSize()
		if( self.sizeInd == self.pixelSquareInd )
		{
			self.FillRect( x - brushSize / 2,y - brushSize / 2,brushSize,brushSize,self.GetCurColor() )
		}
		else self.FillCircle( x,y,brushSize,self.GetCurColor() )
	}
	EraserFunc( x,y,self )
	{
		self.FillCircle( x,y,self.GetBrushSize(),self.bgCol )
	}
	
	FillRect( x,y,w,h,color )
	{
		this.ctx.fillStyle = color
		this.ctx.fillRect( x,y,w,h )
	}
	FillCircle( x,y,rad,color )
	{
		this.ctx.fillStyle = color
		this.ctx.beginPath()
		this.ctx.arc( x,y,rad,0,Math.PI * 2.0 )
		this.ctx.fill()
	}
	
	// from neko quest MapGenLayer
	GenerateQuadCurve( x1,y1,x2,y2,xCtrl,yCtrl,stepSize = 1.0 )
	{
		const xDiff = x2 - x1
		const yDiff = y2 - y1
		const dist = Math.sqrt( xDiff * xDiff + yDiff * yDiff )
		const step = stepSize / dist
		const curveArr = []
		for( let i = 0; i < 1 + step; i += step )
		{
			const x = xCtrl + Math.pow( 1 - i,2 ) * ( x1 - xCtrl ) + i * i * ( x2 - xCtrl )
			const y = yCtrl + Math.pow( 1 - i,2 ) * ( y1 - yCtrl ) + i * i * ( y2 - yCtrl )
			
			curveArr.push( new Vec2( Math.floor( x ), Math.floor( y ) ) )
		}
		return( curveArr )
	}
	
	OnMouseUpdate( mouse )
	{
		if( mouse.down )
		{
			const testMousePos = new Vec2( mouse.x,mouse.y ).Subtract( this.canvPos )
				.Divide( this.canvScale ).Floorify()
			
			const mouseOnCanv = ( testMousePos.x >= 0 && testMousePos.x < this.canvSize.x &&
				testMousePos.y >= 0 && testMousePos.y < this.canvSize.y )
			
			if( !this.prevMouseDown && mouseOnCanv ) this.startClickOnCanvas = true
			
			if( mouseOnCanv && this.startClickOnCanvas )
			{
				let spots = []
				if( !this.prevMousePos.EqualsXY( -1,-1 ) )
				{
					const ctrl = this.prevMousePos.Copy().Add( testMousePos ).Divide( 2 )
					const curve = this.GenerateQuadCurve(
						this.prevMousePos.x,this.prevMousePos.y,
						testMousePos.x,testMousePos.y,
						ctrl.x,ctrl.y )
					spots = curve
				}
				else
				{
					spots.push( testMousePos.Copy().Floorify() )
				}
				
				for( const spot of spots )
				{
					// this.brushShapeFuncs[this.curBrush]( Math.floor( spot.x ),
					// 	Math.floor( spot.y ),
					// 	this.GetBrushSize(),
					// 	this.colors[this.colorInd],
					// 	this )
					this.toolFuncs[this.toolInd]( spot.x,spot.y,this )
				}
				
				this.prevMousePos = testMousePos
			}
			
			// console.log( testMousePos.x + " " + testMousePos.y )
		}
		else
		{
			this.prevMousePos.SetXY( -1,-1 )
			this.startClickOnCanvas = false
		}
		
		this.prevMouseDown = mouse.down
	}
	
	OnCanvResize( gfx )
	{
		const maxXScale = gfx.width / this.canvSize.x
		const maxYScale = gfx.height / this.canvSize.y
		
		this.canvScale = Math.min( maxXScale,maxYScale ) * 0.6
		this.canvPos.x = gfx.width / 2 - this.canvSize.x * this.canvScale / 2
		this.canvPos.y = gfx.height / 2 - this.canvSize.y * this.canvScale / 2
		
		this.iconSize = this.canvScale * 30 * ( ( this.canvSize.x + this.canvSize.y ) / 2 / 200 )
		
		const totalToolSize = this.iconSize * this.toolFuncs.length
		const toolX = this.canvPos.x + ( this.canvSize.x * this.canvScale / 2 ) - totalToolSize / 2
		const toolY = this.canvPos.y - this.iconSize
		for( let i = 0; i < this.toolFuncs.length; ++i )
		{
			this.toolHitboxes[i] = new Hitbox( toolX + i * this.iconSize,toolY,
				this.iconSize,this.iconSize )
		}
		
		const totalColorSize = this.iconSize * this.colors.length
		const colorX = this.canvPos.x + ( this.canvSize.x * this.canvScale / 2 ) - totalColorSize / 2
		const colorY = this.canvPos.y + this.canvSize.y * this.canvScale
		for( let i = 0; i < this.colors.length; ++i )
		{
			// gfx.DrawRect( drawX + i * colDrawSize,drawY,
			// 	colDrawSize,colDrawSize,this.colors[i] )
			this.colorHitboxes[i] = new Hitbox( colorX + i * this.iconSize,colorY,
				this.iconSize,this.iconSize )
		}
		
		const totalSizeSize = this.iconSize * this.sizes.length
		const sizeX = this.canvPos.x + ( this.canvSize.x * this.canvScale / 2 ) - totalSizeSize / 2
		const sizeY = colorY + this.iconSize
		for( let i = 0; i < this.sizes.length; ++i )
		{
			this.sizeHitboxes[i] = new Hitbox( sizeX + i * this.iconSize,sizeY,
				this.iconSize,this.iconSize )
		}
	}
	
	DownloadImage()
	{
		const downloadLink = document.createElement( 'a' )
		downloadLink.href = this.canv.toDataURL( "jpg" )
		downloadLink.download = "nekodraw_image.png"
		downloadLink.click()
		downloadLink.remove()
	}
	
	GetCurColor()
	{
		return( this.colors[this.colorInd] )
	}
	
	GetBrushSize()
	{
		return( this.sizes[this.sizeInd] )
	}
}