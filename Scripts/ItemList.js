class ItemList
{
	constructor()
	{
		this.items = []
	}
	
	GetRandItem()
	{
		return( NekoUtils.ArrayChooseRand( this.items ) )
	}
	
	GetSeededItem( prng )
	{
		return( this.items[prng.NextInt( 0,this.items.length )] )
	}
}