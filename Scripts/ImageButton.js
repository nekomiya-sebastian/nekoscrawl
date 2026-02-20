class ImageButton extends Button
{
	constructor( x,y,spr,centered = false )
	{
		super( 0,0,1,1,centered )
		
		this.spr = spr
		this.sprScale = 1
		
		this.loaded = false
	}
	
	Update( mouse )
	{
		const result = super.Update( mouse )
		
		if( this.spr.loaded && !this.loaded )
		{
			this.width = this.sprScale * this.spr.size.x
			this.height = this.sprScale * this.spr.size.y
			
			this.loaded = true
		}
		
		return( result )
	}
	
	Draw( gfx,unused = "green",unused2 = "lime" )
	{
		// super.Draw( gfx )
		
		if( this.centered ) this.spr.DrawCentered( this.x,this.y,gfx,false,this.sprScale )
		else this.spr.Draw( this.x,this.y,gfx,false,this.sprScale )
	}
	
	UpdateScale( scale )
	{
		if( this.spr.loaded )
		{
			this.width = scale * this.spr.size.x
			this.height = scale * this.spr.size.y
		}
		this.sprScale = scale
	}
}