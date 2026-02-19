class NekoCanv
{
	constructor()
	{
		this.canvPos = Vec2.Zero()
		this.canvSize = new Vec2( 32,32 ) // 200,200
		
		this.canv = document.getElementById( "drawcanv" )
		this.canv.width = this.canvSize.x
		this.canv.height = this.canvSize.y
		
		this.ctx = this.canv.getContext( "2d" )
		this.ctx.imageSmoothingEnabled = false
		this.ctx.mozImageSmoothingEnabled = false
		
		this.canvScale = 1
		
		this.FillRect( 0,0,this.canvSize.x,this.canvSize.y,"white" )
		
		this.prevMousePos = new Vec2( -1,-1 )
	}
	
	Update( mouse,kbd )
	{
		// const botRight = this.canvPos.Copy().Add( this.canvSize.Copy().Scale( this.canvScale ) )
	}
	
	Draw( gfx )
	{
		gfx.context.drawImage( this.canv,this.canvPos.x,this.canvPos.y,
			this.canvSize.x * this.canvScale,this.canvSize.y * this.canvScale )
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
			const brushSize = 3
			const brushCol = "cyan"
			// const brushSize = 1
			// const brushCol = "cyan"
			
			const testMousePos = new Vec2( mouse.x,mouse.y ).Subtract( this.canvPos )
				.Divide( this.canvScale ).Floorify()
			if( testMousePos.x >= 0 && testMousePos.x < this.canvSize.x &&
				testMousePos.y >= 0 && testMousePos.y < this.canvSize.y )
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
					// this.FillRect( Math.floor( spot.x ),
					// 	Math.floor( spot.y ),
					// 	brushSize,brushSize,
					// 	brushCol )
					this.FillCircle( Math.floor( spot.x ),
						Math.floor( spot.y ),
						brushSize / 2,
						brushCol )
				}
				
				this.prevMousePos = testMousePos
			}
			
			// console.log( testMousePos.x + " " + testMousePos.y )
		}
		else this.prevMousePos.SetXY( -1,-1 )
	}
	
	OnCanvResize( gfx )
	{
		const maxXScale = gfx.width / this.canvSize.x
		const maxYScale = gfx.height / this.canvSize.y
		
		this.canvScale = Math.min( maxXScale,maxYScale ) / 2
		this.canvPos.x = gfx.width / 2 - this.canvSize.x * this.canvScale / 2
		this.canvPos.y = gfx.height / 2 - this.canvSize.y * this.canvScale / 2
		
		gfx.context.imageSmoothingEnabled = false
		gfx.context.mozImageSmoothingEnabled = false
	}
}