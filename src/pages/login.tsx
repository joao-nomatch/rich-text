import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Image from 'next/image'
import BrandName from '@/assets/brand-name.png'

export default function Login() {
  const supabase = useSupabaseClient()

  return (
    <div className='relative w-screen h-screen flex'>
      <Image src={BrandName} alt='' className='absolute left-0 top-1/2 -translate-y-1/2 h-screen w-auto p-5'/>
      <div className='w-[400px] flex flex-col gap-8 items-center bg-[#EEEE] justify-center [&>div]:w-full h-fit m-auto px-4 py-5 rounded-[2px]'>
        <h1>Visitors Log</h1>
        <Auth 
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            style: {
              button: {background: 'white', color: 'black', fontSize: '1rem', borderRadius: '19px', border: 'none', marginTop: '33px' },
              input: {background: 'white', border: 'none', borderRadius: '6px'},
              label: {display: 'none'},
            }
           }}
          theme='white'
          providers={[]}
          redirectTo='/'
          showLinks={false}
        /> 
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

  console.log(session)

  if (session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  return {
    props: {}
  }
}