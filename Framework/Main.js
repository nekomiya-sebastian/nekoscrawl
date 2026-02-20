class Main
{
	constructor()
	{
		this.gfx = new Graphics()
		this.mouse = new Mouse( this.gfx )
		this.kbd = new Keyboard( this.gfx )
		
		const colors = []
		const nCols = NekoUtils.RandInt( 1,10 )
		for( let i = 0; i < nCols; ++i ) colors.push( NekoUtils.RandColor() )
		
		this.nekoCanv = new NekoCanv( colors )
		this.mouse.SetNekoCanv( this.nekoCanv )
		this.mouse.SetMain( this )
		this.gfx.SetNekoCanv( this.nekoCanv )
		this.gfx.SetMain( this )
		
		this.requiresUpdate = true
	}
	
	Update( dt )
	{
		this.nekoCanv.Update( this.mouse,this.kbd )
	}
	
	Draw()
	{
		this.nekoCanv.Draw( this.gfx )
		
		const rectSize = 5
		const drawPos = new Vec2( this.mouse.x,this.mouse.y ).Subtract( Vec2.One().Scale( rectSize / 2 ) )
		this.gfx.DrawRect( drawPos.x,drawPos.y,rectSize,rectSize,"red" )
	}
	
	RequestUpdate()
	{
		this.requiresUpdate = true
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
		main.gfx.DrawRect( 0,0,main.gfx.width,main.gfx.height,"#000000" )
		main.Draw()
		
		main.requiresUpdate = false
	}
},delay )