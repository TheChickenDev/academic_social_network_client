import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import DatePicker, { DateRangeType } from 'react-tailwindcss-datepicker'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState, ChangeEvent, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { UserRoundPen } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, UserProfileData } from '@/types/user.type'
import { isValidPhoneNumber } from '@/utils/rules'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'

interface EditProfileFormProps {
  userDetails: (User & UserProfileData) | null
  setUserDetails: (user: User & UserProfileData) => void
}

export default function EditProfileForm({ userDetails, setUserDetails }: EditProfileFormProps) {
  const { t } = useTranslation()
  const [avatar, setAvatar] = useState<string>('')
  const [openForm, setOpenForm] = useState<boolean>(false)
  const [dob, setDob] = useState<DateRangeType>({
    startDate: null,
    endDate: null
  })
  const avatarLabelRef = useRef<HTMLLabelElement>(null)

  const formSchema = z
    .object({
      name: z
        .string()
        .min(1, {
          message: t('myAccount.editProfileForm.nameRequired')
        })
        .max(255, { message: t('myAccount.editProfileForm.nameMax') }),
      phoneNumber: z.string(),
      address: z
        .string()
        .min(1, {
          message: t('myAccount.editProfileForm.addressRequired')
        })
        .max(255, { message: t('myAccount.editProfileForm.addressMax') }),
      aboutMe: z.string().max(2000, { message: t('myAccount.editProfileForm.aboutMeMax') })
    })
    .refine((data) => isValidPhoneNumber(data.phoneNumber), {
      message: t('myAccount.editProfileForm.invalidPhoneNumber'),
      path: ['phoneNumber']
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userDetails?.fullName ?? '',
      phoneNumber: userDetails?.introduction?.contact?.phone ?? ''
    }
  })

  const handleSelectAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatar(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function handleSaveChanges(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (!dob?.startDate) {
      if (avatarLabelRef.current) {
        avatarLabelRef.current.classList.add('text-destructive')
      }
      toast.warning(t('myAccount.editProfileForm.dobRequired'))
    }
    console.log(values)
  }

  useEffect(() => {
    if (avatarLabelRef.current) {
      if (dob?.startDate) avatarLabelRef.current.classList.remove('text-destructive')
      else avatarLabelRef.current.classList.add('text-destructive')
    }
  }, [dob])

  return (
    <Dialog open={openForm} onOpenChange={setOpenForm}>
      <DialogTrigger asChild>
        <Button>
          <UserRoundPen className='mr-2' />
          {t('myAccount.editProfile')}
        </Button>
      </DialogTrigger>
      <DialogContent className='w-4/5 max-w-[560px]'>
        <ScrollArea className='h-[500px]'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveChanges)} className='space-y-4 mr-3'>
              <DialogHeader>
                <DialogTitle>{t('myAccount.editProfile')}</DialogTitle>
                <DialogDescription>{t('myAccount.editProfileDescription')}</DialogDescription>
              </DialogHeader>
              <div className='m-auto'>
                <Label htmlFor='avatar'>
                  <Avatar className='md:w-32 md:h-32 w-24 h-24 border m-auto'>
                    <AvatarImage src={avatar} />
                    <AvatarFallback />
                  </Avatar>
                </Label>
                <input type='file' accept='image/*' id='avatar' onChange={handleSelectAvatar} className='hidden' />
              </div>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-nowrap font-semibold'>{t('myAccount.editProfileForm.name')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-nowrap font-semibold'>
                      {t('myAccount.editProfileForm.phoneNumber')}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-nowrap font-semibold'>
                      {t('myAccount.editProfileForm.address')}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='aboutMe'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-nowrap font-semibold'>
                      {t('myAccount.editProfileForm.aboutMe')}
                    </FormLabel>
                    <FormControl>
                      <Textarea className='resize-none' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className=''>
                <Label htmlFor='dob' className='text-nowrap font-semibold' ref={avatarLabelRef}>
                  {t('myAccount.editProfileForm.dob')}
                </Label>
                <div className='col-span-3 max-w-44 border rounded-md shadow-sm'>
                  <DatePicker
                    asSingle={true}
                    useRange={false}
                    value={dob}
                    onChange={(newValue) =>
                      setDob({ startDate: newValue?.startDate ?? null, endDate: newValue?.endDate ?? null })
                    }
                    displayFormat='DD/MM/YYYY'
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type='submit'>{t('myAccount.saveChanges')}</Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
