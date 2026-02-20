class TextDrawer
{
	constructor()
	{
		this.startLetter = 32
		this.endLetter = 126
		const nLetters = this.endLetter - this.startLetter
		
		this.letterSpr = new Sprite( "Images/NekoFont3x5.png" )
		this.letterSize = new Vec2( 3,5 )
	}
	
	DrawText( text,pos,gfx,centerX = false,centerY = false,scale = 1 )
	{
		let drawX = pos.x
		let drawY = pos.y
		
		if( centerX )
		{
			const totalWidth = text.length * ( this.letterSize.x + 1 ) * scale
			drawX -= totalWidth / 2
		}
		if( centerY )
		{
			const totalHeight = drawY * scale
			drawY -= totalHeight / 2
		}
		
		for( let i = 0; i < text.length; ++i )
		{
			const charCode = text.charCodeAt( i )
			if( charCode >= this.startLetter && charCode <= this.endLetter )
			{
				const letterInd = charCode - this.startLetter
				gfx.context.drawImage( this.letterSpr.sprite,
					letterInd * ( this.letterSize.x + 1 ),0, // source loc
					this.letterSize.x,this.letterSize.y, // source size
					drawX + i * ( this.letterSize.x + 1 ) * scale,drawY * scale, // draw pos
					this.letterSize.x * scale,this.letterSize.y * scale ) // draw scaling
			}
			else
			{
				NekoUtils.Assert( false,"Trying to render invalid character: " + text[i] )
			}
		}
	}
}