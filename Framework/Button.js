class Button extends Hitbox
{
	constructor( x,y,width,height,centered = false )
	{
		super( x,y,width,height,centered )
		
		this.hovering = false
		this.down = false
		this.pressed = false
	}
	
	Update( mouse )
	{
		this.pressed = false
		
		this.down = mouse.down
		if( mouse.down )
		{
			if( this.hovering || mouse.usingTouch ) this.pressed = true
			
			this.hovering = false
		}
		else
		{
			this.hovering = this.Contains( mouse.x,mouse.y )
		}
		
		return( this.Pressed() )
	}
	
	Draw( gfx,regularColor = "green",highlightColor = "lime" )
	{
		const drawCol = this.hovering ? highlightColor : regularColor
		super.Draw( gfx,drawCol )
	}
	
	Pressed()
	{
		return( this.pressed )
	}
}