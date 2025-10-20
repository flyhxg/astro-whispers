import { PropsWithChildren } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-hero-gradient text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-[-10%] h-96 w-96 rounded-full bg-cosmic-500/40 blur-3xl" />
        <div className="absolute right-[5%] top-[20%] h-96 w-96 rounded-full bg-aurora/40 blur-3xl" />
        <div className="absolute left-[40%] bottom-[-20%] h-[28rem] w-[28rem] rounded-full bg-starlight/20 blur-3xl" />
      </div>
      <Navbar />
      <main className="relative px-6 pb-24 pt-24 md:px-10 lg:px-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}

