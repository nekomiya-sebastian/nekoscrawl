class Hitbox
{
	constructor( x,y,width,height,centered = false )
	{
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.centered = centered
	}
	
	Draw( gfx,color = "magenta" )
	{
		let drawX = this.x
		let drawY = this.y
		if( this.centered )
		{
			drawX -= this.width / 2
			drawY -= this.height / 2
		}
		gfx.DrawRect( drawX,drawY,this.width,this.height,color )
	}
	
	MoveTo( x,y )
	{
		this.x = x
		this.y = y
	}
	
	MoveBy( x,y )
	{
		this.x += x
		this.y += y
	}
	
	Contains( x,y )
	{
		if( this.centered )
		{
			x += this.width / 2
			y += this.height / 2
		}
		return( x > this.x && x < this.x + this.width &&
			y > this.y && y < this.y + this.height )
	}
	
	Overlaps( otherHitbox )
	{
		const x = this.x - ( this.centered ? this.width / 2 : 0 )
		const y = this.y - ( this.centered ? this.height / 2 : 0 )
		const otherX = otherHitbox.x - ( otherHitbox.centered ? otherHitbox.width / 2 : 0 )
		const otherY = otherHitbox.y - ( otherHitbox.centered ? otherHitbox.height / 2 : 0 )
		
		return( x + this.width > otherX && x < otherX + otherHitbox.width &&
			y + this.height > otherY && y < otherY + otherHitbox.height )
	}
	
	Expand( amount )
	{
		// this.x -= amount
		// this.y -= amount
		this.width += amount
		this.height += amount
		
		return( this )
	}
	
	GetSize()
	{
		return( new Vec2( this.width,this.height ) )
	}
}