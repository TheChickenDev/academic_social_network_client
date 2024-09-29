import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Link, useNavigate } from 'react-router-dom'
import paths from '@/constants/paths'
import { useMutation } from '@tanstack/react-query'
import { GoogleLoginFormData, LoginFormData } from '@/utils/rules'
import { login, loginGoogle } from '@/apis/auth.api'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/contexts/app.context'
import { saveAccessTokenToLocalStorage, saveRefreshTokenToLocalStorage } from '@/utils/auth'
import { toast } from 'react-toastify'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'

const formSchema = z.object({
  username: z.string().min(1, {
    message: 'Username is required.'
  }),
  password: z.string().min(1, {
    message: 'Password is required.'
  })
})

export default function Login() {
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const { setIsAuthenticated } = useContext(AppContext)
  const [googleResponse, setGoogleResponse] = useState<{
    access_token: string
    expires_in: number
    token_type: string
    scope: string
    authuser: string
    prompt: string
  } | null>(null)

  const loginMutation = useMutation({
    mutationFn: (body: LoginFormData) => login(body)
  })

  const googleLoginMutation = useMutation({
    mutationFn: (body: GoogleLoginFormData) => loginGoogle(body)
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        const status = response.status
        if (status === 200) {
          setIsAuthenticated(true)
          saveAccessTokenToLocalStorage(response.data.data?.access_token)
          saveRefreshTokenToLocalStorage(response.data.data?.refresh_token)
          navigate(paths.home)
          toast.success(response.data.message)
        } else toast.error(response.data.message)
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }

  const handleGoogleLoginSuccess = (response: any) => {
    setGoogleResponse(response)
  }

  const handleGoogleLoginFailure = (error: any) => {
    toast.error(error.message)
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginFailure
  })

  useEffect(() => {
    if (googleResponse) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleResponse.access_token}`, {
          headers: {
            Authorization: `Bearer ${googleResponse.access_token}`,
            Accept: 'application/json'
          }
        })
        .then((res) => {
          if (res?.data) {
            const { email, name, id, picture } = res.data
            const body = {
              email,
              name,
              googleId: id,
              avatar: picture
            }
            googleLoginMutation.mutate(body, {
              onSuccess: (response) => {
                console.log(response)
                setIsAuthenticated(true)
                saveAccessTokenToLocalStorage(response.data.data?.access_token)
                saveRefreshTokenToLocalStorage(response.data.data?.refresh_token)
                navigate(paths.home)
                toast.success(response.data.message)
              },
              onError: (error) => {
                toast.error(error.message)
              }
            })
          }
        })
        .catch((err) => toast.error(err.message))
    }
  }, [googleResponse])

  return (
    <div className='min-h-screen md:flex'>
      <div className='md:w-1/2 w-full bg-black text-white p-12 flex flex-col justify-between'>
        <div>
          <ChromeIcon className='text-white h-6 w-6' />
          <h1 className='text-4xl font-bold mt-2'>SocialNet</h1>
        </div>
        <div>
          <p className='text-lg italic'>
            "Connecting with friends and others has never been easier. SocialNet brings everyone closer together."
          </p>
          <p className='text-lg font-semibold mt-4'>HCMUTE - FIT - K21</p>
        </div>
      </div>
      <div className='md:w-1/2 w-full bg-white p-12 flex flex-col justify-center'>
        <div className='text-right'>
          <Link to='#' className='text-sm font-medium text-gray-600'>
            Login
          </Link>
        </div>
        <div className='mt-12'>
          <h2 className='text-3xl font-bold mb-4'>Create an account</h2>
          <p className='text-gray-600 mb-8'>Enter your account below to sign in.</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2 mb-4'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='enter your username' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder='enter your password' type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='bg-[#f50963] text-white w-full mb-4'>
                {loginMutation.isPending ? (
                  <div className='w-full flex justify-center items-center'>
                    <div className='loader'></div>
                  </div>
                ) : (
                  'Sign in with username'
                )}
              </Button>
            </form>
            <div className='flex items-center mb-4'>
              <div className='flex-grow h-px bg-gray-300' />
              <span className='mx-4 text-sm text-gray-500'>OR CONTINUE WITH</span>
              <div className='flex-grow h-px bg-gray-300' />
            </div>
            <Button
              variant='outline'
              className='flex items-center justify-center w-full mb-4'
              onClick={() => handleGoogleLogin()}
            >
              <ChromeIcon className='text-gray-600 h-5 w-5 mr-2' />
              Google
            </Button>
            <div className='text-center'>
              <p className='text-grey-dark text-sm'>
                Don't have an account?{' '}
                <Link to={paths.register} className='no-underline text-blue font-bold'>
                  Sign up
                </Link>
                .
              </p>
              <p className='text-xs text-gray-500 mt-4'>
                By clicking continue, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

function ChromeIcon(props: { className?: string }) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='12' cy='12' r='10' />
      <circle cx='12' cy='12' r='4' />
      <line x1='21.17' x2='12' y1='8' y2='8' />
      <line x1='3.95' x2='8.54' y1='6.06' y2='14' />
      <line x1='10.88' x2='15.46' y1='21.94' y2='14' />
    </svg>
  )
}
