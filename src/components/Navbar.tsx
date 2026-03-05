import Link from 'next/link'

function Navbar() {
  return (
    <div className='flex border-b-2 border-primary bg-background sticky h-17 justify-around'>
      {/* Left Componenet */}
      <div className='left logo-text text-3xl flex justify-center items-center'>
        Animania
      </div>
      <div className='border-primary border-r-2' />
      {/* Center Componenet */}
      <div className='center p-2 text-xl flex justify-around items-center font-semibold gap-13'>
        <Link href="/">Home</Link>
        <Link href="/">About Us</Link>
        <Link href="/">Explore</Link>
        <Link href="/">Community</Link>
      </div>
      <div className='border-primary border-r-2' />
      {/* Right Component */}
      <div className='right '>
        
      </div>
    </div>
  )
}

export default Navbar
