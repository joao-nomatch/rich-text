import { Auth } from '@supabase/auth-ui-react'
import {
  ThemeSupa,
} from '@supabase/auth-ui-shared'
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid';


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_ANON_KEY!,
)


export function RichText() {

  const [userId, setUserId] = useState('');
  const [mediaToUpload, setMediaToUpload] = useState(Object);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const baseUrl = "https://cmwixhsplibbualtcozz.supabase.co/storage/v1/object/public/test/"

  const getUser = async () => {

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user !== null) {
        setUserId(user.id);
        console.log('userId:' + user.id)
      } else {
        setUserId('');
      }
    } catch (e) {
    }
  }

  function handleMediaToUpload(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setMediaToUpload(e.target.files[0])
    }
  }

  const signout = async () => {
    setUserId('');
    await supabase.auth.signOut();
  }

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!text || !mediaToUpload || !author){
      alert('Preencha com campos válidos.');
      return;
    }

    try {
      let mediaId = uuidv4()
      let img_url = baseUrl + userId + '/' + mediaId
      console.log(img_url)
  
      await supabase
        .storage
        .from('posts-images')
        .upload(userId + "/" + mediaId, mediaToUpload)

      await supabase
      .from('Posts')
      .insert([{text:text, img_url: img_url, author: author}])
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getUser();
  }, [userId])

  return (
    <div className='max-w-3xl m-auto h-screen w-full flex relative [&>div]:h-screen [&>div]:flex [&>div]:items-center [&>div]:mx-auto [&>div]:w-72'>
      {userId === '' ? <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
      /> 
      : 
        <section className='m-auto flex flex-col items-start gap-10 w-full'>
          <div className='flex flex-col gap-2 w-full'>
            <h2>Autor:</h2>
            <input onChange={(e) => setAuthor(e.target.value)} className='p-3 border-neutral-500 border w-1/2 h-min rounded-md'/>
          </div>
          <div className='flex flex-col gap-2 w-full'>
            <h2>Digite aqui seu texto:</h2>
            <textarea onChange={(e) => setText(e.target.value)} className='p-3 border-neutral-500 border w-full h-40 rounded-md resize-none'/>
          </div>
          <input type="file" onChange={(e) => handleMediaToUpload(e)} />
          <button type='submit' onClick={handleSubmit} className='border-neutral-500 border rounded-md p-2'>
            Enviar
          </button>
          <button type='button' onClick={signout} className='absolute top-10 right-10 border-neutral-500 border rounded-md p-2'>
            Logout
          </button>
        </section>

      }
    </div >
  )
}