import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import paths from '@/constants/paths'
import { useMutation } from '@tanstack/react-query'
import { ResetPasswordFormData } from '@/types/rule.type'
import { resetPassword } from '@/apis/auth.api'
import { useContext, useState } from 'react'
import { saveAccessTokenToLocalStorage, saveRefreshTokenToLocalStorage } from '@/utils/auth'
import { toast } from 'sonner'
import { decodeJWT } from '@/utils/utils'
import { useTranslation } from 'react-i18next'
import Spinner from '@/components/Spinner'
import Logo from '@/components/Logo'
import { isValidInputPassword } from '@/utils/rules'
import { Eye, EyeOff } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { AppContext } from '@/contexts/app.context'

export default function ResetPassword() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const { setUserId, setEmail, setFullName, setAvatar, setIsAuthenticated } = useContext(AppContext)
  const { token } = useParams()

  const formSchema = z
    .object({
      password: z
        .string()
        .min(8, {
          message: t('register.passwordMin')
        })
        .max(255, { message: t('register.passwordMax') }),
      confirm_password: z.string()
    })
    .refine((data) => isValidInputPassword(data.password), {
      message: t('register.passwordInvalid'),
      path: ['password']
    })
    .refine((data) => data.password === data.confirm_password, {
      message: t('register.passwordNotMatch'),
      path: ['confirm_password']
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirm_password: ''
    }
  })

  const resetMutation = useMutation({
    mutationFn: (body: ResetPasswordFormData) => resetPassword(body)
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    resetMutation.mutate(
      { ...data, token },
      {
        onSuccess: (response) => {
          const status = response.status
          if (status === 200) {
            const user = decodeJWT(response.data.data?.access_token)
            setIsAuthenticated(true)
            setUserId?.(user?._id ?? '')
            setEmail?.(user?.email ?? '')
            setFullName?.(user ? (user.fullName ?? '') : '')
            setAvatar?.(user?.avatar ?? '')
            saveAccessTokenToLocalStorage(response.data.data?.access_token)
            saveRefreshTokenToLocalStorage(response.data.data?.refresh_token)
            navigate(paths.home)
            toast.success(response.data.message)
          } else toast.error(t('login.invalidCredentials'))
        },
        onError: () => {
          toast.error(t('login.invalidCredentials'))
        }
      }
    )
  }

  return (
    <>
      <Helmet>
        <title>{t('resetPassword.title')}</title>
      </Helmet>
      <div className='md:w-1/2 w-full h-screen xl:px-36 lg:px-8 px-4 flex flex-col justify-center mx-auto'>
        <Link to={paths.home}>
          <Logo className='w-full mb-4 dark:fill-white' />
        </Link>
        <h2 className='text-3xl font-bold mb-2'>{t('resetPassword.title')}</h2>
        <p className='text-gray-600 mb-4'>{t('resetPassword.subtitle')}</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2 mb-4'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('resetPassword.newPassword')}</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        placeholder={t('resetPassword.newPassword')}
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                      />
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
                  <FormLabel>{t('resetPassword.confirmNewPassword')}</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        placeholder={t('resetPassword.confirmNewPassword')}
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                      />
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
            <Button type='submit' className='bg-[#f50963] text-white w-full' disabled={resetMutation.isPending}>
              {resetMutation.isPending ? <Spinner size='24' /> : t('action.submit')}
            </Button>
          </form>
        </Form>
      </div>
    </>
  )
}
