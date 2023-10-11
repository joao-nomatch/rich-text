'use client'
import { Auth } from '@supabase/auth-ui-react'
import {ThemeSupa} from '@supabase/auth-ui-shared'
import { ChangeEvent, useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid';
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/app/components/ui/use-toast"

const baseUrl = "https://cmwixhsplibbualtcozz.supabase.co/storage/v1/object/public/test/"
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_ANON_KEY!,
)

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function RichText() {

  const [userId, setUserId] = useState('');
  const { toast } = useToast()

  const formSchema = z.object({
    author: z.string().min(1, {message: 'Esse campo precisa ser preenchido.'}),
    text: z.string().min(1, {message: 'Esse campo precisa ser preenchido.'}),
    img_file: z
    .any()
    .refine((file) => file?.length > 0, "Escolha uma imagem.")
    .refine((file) => file?.[0].size <= MAX_FILE_SIZE, `A imagem deve ter até 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0].type),
      "Formato inválido de arquivo, selecione arquivos .jpg, .jpeg, .png ou .webp ."
    )
  })

  type FormSchema = z.infer<typeof formSchema>;


  const {register,handleSubmit, formState: {errors, isSubmitting}} = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

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

  const signout = async () => {
    setUserId('');
    await supabase.auth.signOut();
  }

  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    const {author, text, img_file} = data

    try {
      let mediaId = uuidv4()
      let img_url = baseUrl + userId + '/' + mediaId
  
      await supabase
        .storage
        .from('posts-images')
        .upload(userId + "/" + mediaId, img_file[0])

      await supabase
      .from('Posts')
      .insert([{text:text, img_url: img_url, author: author}])

      toast({
        title:'Sucesso!',
        description:'Post enviado com sucesso.'
      });
    } catch (error) {
      toast({
        title:'Erro',
        description:'Não foi possível enviar o post.'
      });
    }
  }

  useEffect(() => {
    getUser();
  }, [userId])

  return (
    <div className=' m-auto h-screen w-full flex text-neutral-700 bg-white relative [&>div]:h-screen [&>div]:flex [&>div]:flex-col [&>div]:items-center [&>div]:mx-auto [&>div]:w-72'>
      {userId === '' ? <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme='white'
      /> 
      : 
        <form onSubmit={handleSubmit(onSubmit)} className='m-auto flex flex-col items-start gap-10 w-full max-w-3xl'>
          <div className='flex flex-col gap-2 w-full'>
            <h2>Autor:</h2>
            <input className='p-3 border-neutral-500 border w-1/2 h-min rounded-md' {...register("author")}/>
            {errors.author && <span className='text-red-500'>{errors.author.message}</span>}
          </div>
          <div className='flex flex-col gap-2 w-full'>
            <h2>Digite aqui seu texto:</h2>
            <textarea className='p-3 border-neutral-500 border w-full h-40 rounded-md resize-none ' {...register("text")}/>
            {errors.author && <span className='text-red-500'>{errors.author.message}</span>}
          </div>
          <input type="file" {...register("img_file")}/>
          {errors.img_file && <span className='text-red-500'>{errors.img_file.message}</span>}
          <button disabled={isSubmitting} type='submit'className='border-neutral-500 border rounded-md p-2 disabled:bg-neutral-200'>
            Enviar
          </button>
          <button type='button' onClick={signout} className='absolute top-10 right-10 border-neutral-500 border rounded-md p-2 '>
            Logout
          </button>
        </form>

      }
    </div >
  )
}