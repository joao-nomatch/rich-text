import { createPagesBrowserClient, createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import Placeholder from '@/assets/placeholder.jpg'
import BrandName from '@/assets/brand-name.png'
import { useEffect, useState } from "react";
import { TABLE_NAME } from "@/db/config";

interface ILog {
  author: string
  created_at: string
  id: number
  img_url: string
  text: string
}

export default function Home() {
  const [logs, setLogs] = useState<ILog[]>([])
  const supabase = createPagesBrowserClient()

  
  useEffect(() => {
    const getLogContent = async () => {
      const {data} = await supabase.from(TABLE_NAME).select()
      if(data){
        setLogs(data as ILog[])
      }
    }
    getLogContent()
    }
  , [])

  return (
    <div className="w-screen h-screen relative flex justify-center pt-5">
      <Image src={BrandName} alt='' className='absolute left-0 top-1/2 -translate-y-1/2 h-screen w-auto p-5'/>
      <div className="flex flex-col items-center max-w-[470px] gap-[52px]">
        <Link href='/editor' className="rounded-[19px] bg-[#E4E4E4] w-full text-center py-2">Create new log</Link>
        <div className="flex flex-col gap-[33px]">
          {logs.map((content) => (
            <div className="flex flex-col" key={content.id}>
              <h2 className="text-xl mb-[33px]">{content.text}</h2>
              <div className="flex justify-between text-xs mb-4 pb-4 border-b border-b-black">
                <span>{content.author}</span>
                <span>Entry n.{content.id}</span>
                <span>{content.created_at.slice(0, 10)}</span>
              </div>
              {content.img_url !== null && 
                <img src={content.img_url} alt='' className="object-cover"/>
              }
            </div>
          ))}
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