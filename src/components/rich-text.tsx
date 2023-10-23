import { v4 as uuidv4 } from 'uuid';
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast"
import { BASE_URL, BUCKET_NAME, MAX_FILE_SIZE, TABLE_NAME } from '@/db/config';
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

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

export function RichText() {
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
        
      const { data: { path }, error: uploadError } = await supabase
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
      <form onSubmit={handleSubmit(onSubmit)} className='m-auto flex flex-col items-start gap-10 w-full max-w-3xl'>
        <div className='flex flex-col gap-2 w-full'>
          <h2>Author:</h2>
          <input className='p-3 border-neutral-500 border w-1/2 h-min rounded-md' {...register("author")}/>
          {errors.author && <span className='text-red-500'>{errors.author.message}</span>}
        </div>
        <div className='flex flex-col gap-2 w-full'>
          <h2>Your log:</h2>
          <textarea className='p-3 border-neutral-500 border w-full h-40 rounded-md resize-none ' {...register("text")}/>
          {errors.author && <span className='text-red-500'>{errors.author.message}</span>}
        </div>
        <input type="file" {...register("imgFile")}/>
        {errors.imgFile && <span className='text-red-500'>{String(errors.imgFile.message)}</span>}
        <button disabled={isSubmitting} type='submit'className='border-neutral-500 border rounded-md p-2 disabled:bg-neutral-200'>
          Submit
        </button>

        <button type='button' onClick={signOut} className='absolute top-10 right-10 border-neutral-500 border rounded-md p-2 '>
          Logout
        </button>
      </form>
    </div >
  )
}

