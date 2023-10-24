import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import Placeholder from '@/assets/placeholder.jpg'
import BrandName from '@/assets/brand-name.png'

export default function Editor() {
  return (
    <div className="w-screen h-screen relative flex justify-center pt-5">
      <Image src={BrandName} alt='' className='absolute left-0 top-1/2 -translate-y-1/2 h-screen w-auto p-5'/>
      <div className="flex flex-col items-center max-w-[470px] gap-[52px]">
        <Link href='/editor' className="rounded-[19px] bg-[#E4E4E4] w-full text-center py-2">Create new log</Link>
        <div className="flex flex-col gap-[33px]">
          <div className="flex flex-col">
            <h2 className="text-xl mb-[33px]">Log Title</h2>
            <div className="flex justify-between text-xs mb-4 pb-4 border-b border-b-black">
              <span>Author Name</span>
              <span>Log id</span>
              <span>Log date</span>
            </div>
            <Image src={Placeholder} alt='' />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl mb-[33px]">Log Title</h2>
            <div className="flex justify-between text-xs mb-4 pb-4 border-b border-b-black">
              <span>Author Name</span>
              <span>Log id</span>
              <span>Log date</span>
            </div>
            <Image src={Placeholder} alt='' />
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createPagesServerClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()


  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  }
}