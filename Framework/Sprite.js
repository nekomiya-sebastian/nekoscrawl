class Sprite
{
	constructor( path )
	{
		this.sprite = new Image()
		this.sprite.src = path
		this.size = Vec2.Zero()
		
		this.loaded = false
		
		const self = this
		this.sprite.onload = function()
		{
			self.size.x = self.sprite.width
			self.size.y = self.sprite.height
			self.loaded = true
		}
		this.sprite.onerror = function()
		{
			NekoUtils.Assert( false,"Sprite failed to load! " + path )
			self.loaded = false
		}
	}
	
	Draw( x,y,gfx,flipped = false,scale = 1 )
	{
		gfx.DrawSprite( x,y,this,flipped,scale )
	}
	
	DrawCentered( x,y,gfx,flipped = false,scale = 1 )
	{
		if( this.loaded )
		{
			gfx.DrawSprite( x - ( this.size.x * scale ) / 2,
				y - ( this.size.y * scale ) / 2,
				this,flipped,scale )
		}
	}
	
	PartDraw( pos,gfx,flipped,scale )
	{
		this.Draw( pos.x,pos.y,gfx,flipped,scale )
	}
}