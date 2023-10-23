import { TABLE_NAME } from "@/db/config"
import { createPagesBrowserClient, createPagesServerClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"

export default function Records() {
  const supabase = createPagesBrowserClient()
  const [logs, setLogs] = useState([])
  
  useEffect(() => {
    async function startFetch() {
      const { data, error } = await supabase.from(TABLE_NAME).select()

      setLogs(data)
    }

    startFetch()
  }, [])

  return (
    <div>
      {logs?.map(log => (
        <div>
          <h2>{log.author}</h2>
          <p>{log.text}</p>
          <img src={log.img_url}/>
        </div>
      ))}
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