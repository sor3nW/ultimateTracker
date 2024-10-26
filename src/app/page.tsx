import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
    <Navbar />
    <div className="flex h-screen md:pb-28 lg:pb-28 w-full justify-center items-center">
      <h1 className="text-6xl"> ULTIMATE FRISBEE</h1>
    </div>
    <Footer />
    </>
  )
}
