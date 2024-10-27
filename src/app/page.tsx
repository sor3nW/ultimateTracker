import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
export default function Home() {
  return (
    <>
    <Navbar />
    <div className="flex md:pb-28 lg:pb-28 w-full justify-center items-center flex-col">
      <h1 className="text-6xl font-bold pt-32"> Ultimate Tracker</h1>
      <h2> The Ultimate Tracking software for teams of any kind - Sign Up Now! <Image src="/rightuparrow.png" width={25} height={25} alt='arrow' className='inline'/> </h2>
      <p className='w-3/5 py-8'> <b>The History: </b> As a player on the UTSA Ultimate Frisbee team I noticed that there was a drop in team competitiveness and spirit. 
      To counteract this our leadership team decided to introduce a ranking system to our team that would allow players to enjoy friendly competition within 
      the team and challenge themselves to be better each practice. To help achieve this goal I set out to create an application where our team can track key metrics
      on our players without having to go through the struggles and pains of using excel sheets. My application allows users to create teams where they can invite their friends or teammates 
      In my application you can join an existing team or create a new one. Within your team you can easily track everyones events in the admin page. All the data is stored in a firestore database 
      which also gives your team realtime access to all of its key metrics. </p>
      <div className='w-full grid grid-cols-2'>
        <div className='grid-span-1 flex items-center flex-col'>
          <h1 className='pl-16 text-4xl font-bold '>The Competition ------{'>'} </h1>
          <p className='pl-16 py-8'> Microsoft Excel is great for many uses. However, as you can see on the right it can be very tedious and honestly unsatisfying to use in many cases. Take for example
            an Ultimate Frisbee team that has 15 players where each player wants to see their metrics. This would require each player to log their work manually on the excel sheet. Not only does this require manual effort
            but who wants to look at spreadsheets all day?!
          </p>
        </div>
        <div className='grid-span-1 flex justify-center items-center'>

          <Image src='/exceltwo.jpg' width={600} height={500} alt='ewww excel' />
        </div>
      </div>
      <div className='w-full grid grid-cols-2 pt-16'>
        <div className='grid-span-1 flex justify-center items-center'>
          <Image src='/dashboard.png' width={600} height={500} alt='yayyy ultimate tracker' />
        </div>
        <div className='grid-span-1 flex items-center flex-col '>
          <h1 className='text-4xl font-bold pr-20'>{"<"}------- The Solution </h1>
          <p className='pr-16 py-8'> Ultimate Tracker is a web application that allows teams to track key metrics on their players. This application is built using Next.js, Tailwindcss, and Clerk. 
            With Ultimate Tracker players can track their metrics in real time and see how they stack up against their teammates. This application is a great way to bring teams together and foster a competitive spirit. 
            </p>
        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}
