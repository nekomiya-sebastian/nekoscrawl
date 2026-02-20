// inspired/lifted from Sneko Slayers PseudoRandom
class PseudoRandom
{
	constructor( seed )
	{
		this.maxSeed = 999999
		this.seedBuff = 99
		this.seed = seed
	}
	
	Next()
	{
		++this.seed
		while( this.seed > this.maxSeed ) this.seed -= this.maxSeed
		const rand = this.FakeSin( this.seed ) * this.seedBuff
		return( rand - Math.floor( rand ) )
	}
	
	NextFloat( min,max )
	{
		return( ( this.Next() * ( max - min ) ) + min )
	}
	
	NextInt( min,max )
	{
		return( Math.floor( this.NextFloat( min,max ) ) )
	}
	
	FakeSin( x )
	{
		x *= ( Math.PI * 20 )
		const t = x - Math.floor( x )
		let result = 0
		if( t < 0.5 ) result = ( -0.4 * t * ( t - Math.PI ) )
		else result = ( 0.4 * ( t - 2.0 * Math.PI ) * ( t - Math.PI ) )
		
		return( result - Math.floor( result ) )
	}
	
	RandColor()
	{
		let color = "#"
		
		for( let i = 0; i < 6; ++i )
		{
			const choice = this.NextInt( 0,9 + 6 )
			if( choice < 9 ) color += this.NextInt( 0,9 ).toString()
			else color += String.fromCharCode( 65 + this.NextInt( 0,6 ) )
		}
		
		return( color )
	}
}