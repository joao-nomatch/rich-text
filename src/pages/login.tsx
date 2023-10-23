import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default function Login() {
  const supabase = useSupabaseClient()

  return (
    <div className='w-[400px] mx-auto h-screen flex items-center justify-center [&>div]:w-full'>
      <Auth 
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme='white'
        providers={[]}
        redirectTo='/'
      /> 
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