class Graphics
{
	constructor()
	{
		this.canvas = document.getElementById( "nekocanv" )
		this.context = this.canvas.getContext( "2d" )
		
		this.context.imageSmoothingEnabled = false
		this.context.mozImageSmoothingEnabled = false
		
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		
		this.width = this.canvas.width
		this.height = this.canvas.height
		
		// console.log( this.width + " " + this.height )
		
		this.nekoCanv = null
		this.main = null
		
		const self = this
		addEventListener( "resize",function( e )
		{
			self.UpdateCanvSize( self )
		} );
	}
	
	UpdateCanvSize( self )
	{
		self.width = self.canvas.width = window.innerWidth
		self.height = self.canvas.height = window.innerHeight
		
		if( self.nekoCanv ) self.nekoCanv.OnCanvResize( self )
		if( self.main ) self.main.RequestUpdate()
	}
	
	SetNekoCanv( nekoCanv )
	{
		this.nekoCanv = nekoCanv
		this.UpdateCanvSize( this )
	}
	
	SetMain( main )
	{
		this.main = main
	}
	
	DrawRect( x,y,w,h,c )
	{
		this.context.fillStyle = c
		this.context.fillRect( Math.floor( x ),Math.floor( y ),
			Math.floor( w ),Math.floor( h ),c )
	}
	
	DrawSprite( x,y,sprite,flipped = false,scale = 1 )
	{
		if( flipped )
		{
			this.context.save()
			this.context.translate( this.width,0 )
			this.context.scale( -1,1 )
			
			this.context.drawImage( sprite.sprite,this.width - x,y,
				-sprite.size.x * scale,sprite.size.y * scale )
			
			this.context.scale( -1,1 )
			this.context.translate( -this.width,0 )
		}
		else this.context.drawImage( sprite.sprite,x,y,sprite.size.x * scale,sprite.size.y * scale )
	}
}