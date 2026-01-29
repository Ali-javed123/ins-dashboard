
'use client'
import { useCallback,useEffect,useState,useRef } from 'react'
import HomeSliderCard from './HomeSlide'
import img from './img1.jpg'
import { supabase } from "@/lib/supabase-client"

import { Button } from '@/components/ui/button'
interface User {
  id: string;
  tilte: string;
  heading: number;
  image: string;
  

  profileImageUrl?: string | null | undefined; // undefined भी allow करें
}

interface FormData {
  username: string;
  age: string;
  gender: string;
  profileImage: File | null;
}
export default function HomeSlider() {
 



    const [open, setOpen] = useState<boolean>(false)


   
  
//   return (
//     <div
//   className="
//     min-h-screen w-full 
//     bg-[hsl(var(--color-background))] 
//     dark:bg-[hsl(var(--color-background-dark))] 
//     flex items-center justify-center gap-6 p-4 flex-wrap
//   "
// >
//       <div className="w-full h-12  relatve flex  justify-end items-center">
//         <div >

//             <Button className=' font-lg   ' onClick={() => setOpen(true)}>
//         Open Modal
//       </Button>
//         </div>
 

//       </div>

//       <HomeSliderCard
//         imageSrc={img}
//         title="Digital Marketing"
//         heading="Grow your business with our expert marketing services."
//         buttonOneText="Get Started"
//         buttonTwoText="Learn More"
//         open={open}
//         setOpen={setOpen}
//       />
      

    
//     </div>
//   )
  return (
    <div className="w-full space-y-2 bg-[hsl(var(--color-background))] 
    dark:bg-[hsl(var(--color-background))] ">
      <div className='px-3'>

      <div className="flex justify-end my-7">
        <Button onClick={() => setOpen(true)}>
          Open Modal
        </Button>
      </div>

      {/* Slider Section */}
      <HomeSliderCard
        imageSrc={img}
        open={open}
        setOpen={setOpen}
      />
      </div>
      {/* Top Action Bar */}

    </div>


  )

}
