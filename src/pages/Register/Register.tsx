import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Link, useNavigate } from 'react-router-dom'
import paths from '@/constants/paths'
import { useMutation } from '@tanstack/react-query'
import { GoogleLoginFormData, LoginFormData } from '@/types/rule.type'
import { getGoogleInfo, login, loginGoogle } from '@/apis/auth.api'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/contexts/app.context'
import { saveAccessTokenToLocalStorage, saveRefreshTokenToLocalStorage } from '@/utils/auth'
import { toast } from 'react-toastify'
import { useGoogleLogin } from '@react-oauth/google'
import { decodeJWT } from '@/utils/utils'
import { useTranslation } from 'react-i18next'
import Spinner from '@/components/Spinner'
import Logo from '@/components/Logo'
import { isValidInputPassword } from '@/utils/rules'
import { Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)

  const formSchema = z
    .object({
      email: z
        .string()
        .min(1, {
          message: t('email-required')
        })
        .max(255, { message: t('email-max') })
        .email({ message: t('email-invalid') }),
      password: z
        .string()
        .min(8, {
          message: t('password-min')
        })
        .max(255, { message: t('password-max') }),
      confirm_password: z.string()
    })
    .refine((data) => isValidInputPassword(data.password), {
      message: t('password-invalid'),
      path: ['password']
    })
    .refine((data) => data.password === data.confirm_password, {
      message: t('password-not-match'),
      path: ['confirm_password']
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm_password: ''
    }
  })

  const { setIsAuthenticated, setFullName, setAvatar } = useContext(AppContext)
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
          const user = decodeJWT(response.data.data?.access_token)
          setIsAuthenticated(true)
          setFullName?.(user ? (user.fullName ?? '') : '')
          setAvatar?.(user?.avatar ?? '')
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
      getGoogleInfo(googleResponse.access_token)
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
                const user = decodeJWT(response.data.data?.access_token)
                setIsAuthenticated(true)
                setFullName?.(user?.fullName ?? '')
                setAvatar?.(user?.avatar ?? '')
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
      <div className='md:w-1/2 w-full bg-white xl:px-36 lg:px-8 px-4 flex flex-col justify-center'>
        <h2 className='text-3xl font-bold mb-2'>{t('sign-up')}</h2>
        <p className='text-gray-600 mb-4'>{t('register.subtitle')}</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2 mb-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('enter-email')} {...field} />
                  </FormControl>
                  <FormMessage className='italic' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password')}</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input placeholder={t('enter-password')} type={showPassword ? 'text' : 'password'} {...field} />
                      <button
                        type='button'
                        className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className='italic' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirm_password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('confirm-password')}</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input placeholder={t('enter-password')} type={showPassword ? 'text' : 'password'} {...field} />
                      <button
                        type='button'
                        className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className='italic' />
                </FormItem>
              )}
            />
            <Button type='submit' className='bg-[#f50963] text-white w-full' disabled={loginMutation.isPending}>
              {loginMutation.isPending ? <Spinner size='24' /> : t('sign-up')}
            </Button>
          </form>
          <div className='flex items-center mb-4'>
            <div className='flex-grow h-px bg-gray-300' />
            <span className='mx-4 text-sm text-gray-500'>{t('or-continue-with')}</span>
            <div className='flex-grow h-px bg-gray-300' />
          </div>
          <Button
            variant='outline'
            className='flex items-center justify-center w-full mb-2'
            onClick={() => handleGoogleLogin()}
          >
            <svg
              className='text-gray-600 h-5 w-5 mr-2'
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
            Google
          </Button>
          <div className='text-center'>
            <p className='text-grey-dark text-sm'>
              {t('have-account')}&nbsp;
              <Link to={paths.login} className='no-underline text-blue font-bold'>
                {t('sign-in')}
              </Link>
              .
            </p>
            <p className='text-xs text-gray-500 mt-1'>{t('accept-terms')}</p>
          </div>
        </Form>
      </div>
      <div className='md:w-1/2 w-full bg-black text-white lg:p-8 p-4 flex flex-col justify-between'>
        <div className='w-fit'>
          <Link to={paths.home}>
            <Logo className='fill-white' />
          </Link>
        </div>
        <div>
          <h2 className='text-xl italic mt-4'>{t('login.text1')}</h2>
          <h2 className='text-2xl font-semibold mt-4'>{t('login.text2')}</h2>
        </div>
      </div>
    </div>
  )
}
