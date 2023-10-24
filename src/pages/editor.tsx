import { v4 as uuidv4 } from 'uuid';
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast"
import { BASE_URL, BUCKET_NAME, MAX_FILE_SIZE, TABLE_NAME } from '@/db/config';
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import Image from 'next/image';
import BrandName from '@/assets/brand-name.png'

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  author: z.string().min(3, {message: 'This field is required.'}),
  text: z.string(),
  imgFile: z
  .any()
  .refine((files) => files?.length == 1, "Image is required.")
  .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 10MB.")
  .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0].type), ".jpg, .jpeg, .png and .webp files are accepted.")
})

type FormSchema = z.infer<typeof formSchema>;

export default function Editor() {
   const supabase = createPagesBrowserClient()

  const { toast } = useToast()

  const {register,handleSubmit, formState: { errors, isSubmitting }} = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const signOut = async () => {
    await supabase.auth.signOut();
  }

  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    const {author, text, imgFile } = data

    try {
      const { data: { user } } = await supabase.auth.getUser()!

      const imgPath = `${user!.id}/${uuidv4()}-${imgFile[0].name}` 
        
      const { data: path , error: uploadError } = await supabase
        .storage
        .from(BUCKET_NAME)
        .upload(imgPath, imgFile[0])
    
      if (uploadError) {
        console.error(uploadError)
        throw new Error(uploadError.message)
      }

      const img_url = `${BASE_URL}${path}`

      const { error: insertError } =await supabase
      .from(TABLE_NAME)
      .insert([{text:text, author: author, img_url}])

       if (insertError) {
        console.error(insertError)
        throw new Error(insertError.message)
      }

      toast({
        title:'Success!',
        description:'Log created.'
      });
    } catch (error) {
      toast({
        title:'Error',
        description:'Something went wrong! Try again.'
      });
    }
  }

  return (
    <div className=' m-auto h-screen w-full flex text-neutral-700 bg-white relative [&>div]:h-screen [&>div]:flex [&>div]:flex-col [&>div]:items-center [&>div]:mx-auto [&>div]:w-72'>
      <Image src={BrandName} alt='' className='absolute left-0 top-1/2 -translate-y-1/2 h-screen w-auto p-5'/>
      <form onSubmit={handleSubmit(onSubmit)} className='m-auto flex flex-col items-center gap-10 w-full max-w-[400px] bg-[#EEEEEE] p-5 rounded-[2px]'>
        <h1>Create a new log</h1>
        <div className='flex-col flex gap-3 w-full'>
            <div className='flex flex-col gap-2 w-full'>
            <input className='p-3 w-full h-min rounded-md' placeholder='Author' {...register("author")}/>
            {errors.author && <span className='text-red-500'>{errors.author.message}</span>}
            </div>
            <div className='flex flex-col gap-2 w-full'>
            <textarea className='p-3 w-full h-40 rounded-md resize-none' placeholder='Log' {...register("text")}/>
            {errors.author && <span className='text-red-500'>{errors.author.message}</span>}
            </div>
            <label htmlFor="image-input" className='w-full bg-white cursor-pointer text-[#8C8C8C] px-3 py-2 rounded-md' >Upload an image +</label>
            <input id='image-input' type="file" {...register("imgFile")} placeholder='Upload an image +' className='hidden'/>
            {errors.imgFile && <span className='text-red-500'>{String(errors.imgFile.message)}</span>}
        </div>
        <button disabled={isSubmitting} type='submit'className='rounded-[19px] p-2 disabled:bg-neutral-200 bg-white w-full'>
          Publish
        </button>

        <button type='button' onClick={signOut} className='absolute top-10 right-10'>
          Logout
        </button>
      </form>
    </div >
  )
}

