import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import DatePicker from 'react-tailwindcss-datepicker'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState, ChangeEvent, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Trash2,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  Mail,
  MapPinHouse,
  Pencil,
  Phone,
  BookHeart
} from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Education, User } from '@/types/user.type'
import { isValidPhoneNumber } from '@/utils/rules'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateUser } from '@/apis/user.api'
import EducationDialog from './EducationDialog'
import WorkDialog from './WorkDialog'
import { getValidYearForAgePicker } from '@/utils/utils'
import Loading from '@/components/Loading'

interface EditProfileFormProps {
  userDetails: User | null
  setUserDetails: React.Dispatch<React.SetStateAction<User | null>>
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function EditProfileForm({ userDetails, setUserDetails, setEditMode }: EditProfileFormProps) {
  const { t } = useTranslation()
  const [avatar, setAvatar] = useState<string>(userDetails?.avatarImg ?? '')
  const [dob, setDob] = useState<Date | null>(userDetails?.dateOfBirth ?? null)
  const [educationData, setEducationData] = useState<Education[]>(
    userDetails?.introduction?.educations ? [...userDetails.introduction.educations] : []
  )
  const [workData, setWorkData] = useState(userDetails?.introduction?.jobs ? [...userDetails.introduction.jobs] : [])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dobLabelRef = useRef<HTMLLabelElement>(null)
  const dobMessageRef = useRef<HTMLParagraphElement>(null)

  const formSchema = z
    .object({
      name: z
        .string()
        .min(1, {
          message: t('myAccount.editProfileForm.nameRequired')
        })
        .max(255, { message: t('myAccount.editProfileForm.nameMax') }),
      phoneNumber: z.string(),
      gender: z.enum(['Male', 'Female', 'Other', '']),
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
    .refine((data) => data.address !== t('myAccount.noAddress'), {
      message: t('myAccount.editProfileForm.addressRequired'),
      path: ['address']
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userDetails?.fullName ?? '',
      phoneNumber: userDetails?.introduction?.contact?.phone ?? t('myAccount.noPhoneNumber'),
      gender: (userDetails?.gender as 'Male' | 'Female' | 'Other' | '') ?? t('myAccount.noGender'),
      address: userDetails?.introduction?.address ?? t('myAccount.noAddress'),
      aboutMe: userDetails?.description ?? t('myAccount.noAboutMe')
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
    if (!dob) {
      if (dobLabelRef.current) {
        dobLabelRef.current.classList.add('text-destructive')
        dobMessageRef.current?.classList.remove('hidden')
      }
      toast.warning(t('myAccount.editProfileForm.dobRequired'))
      return
    }
    const formData = new FormData()
    formData.append('email', userDetails?.email ?? '')
    formData.append('fullName', values.name)
    formData.append('dateOfBirth', dob ? dob.toString() : '')
    formData.append('gender', values.gender)
    formData.append('phoneNumber', values.phoneNumber)
    formData.append('description', values.aboutMe)
    formData.append(
      'introduction',
      JSON.stringify({
        ...userDetails?.introduction,
        address: values.address,
        contact: { phone: values.phoneNumber, links: [], isPrivate: false },
        jobs: workData,
        educations: educationData
      })
    )
    const files = (document.getElementById('avatar') as HTMLInputElement).files
    if (files && files.length > 0) {
      formData.append('images', files[0])
    }

    setIsLoading(true)

    updateUser(formData)
      .then((data) => {
        if (data.status === 200) {
          const newData = {
            ...userDetails,
            fullName: values.name,
            dateOfBirth: dob ?? null,
            description: values.aboutMe,
            introduction: {
              ...userDetails?.introduction,
              address: values.address,
              contact: { phone: values.phoneNumber, links: [], isPrivate: false },
              jobs: workData,
              educations: educationData
            }
          }

          setUserDetails({ ...newData } as User)
          setEditMode(false)
          toast.success(t('myAccount.editProfileForm.updateSuccessful'))
        }
      })
      .catch(() => {
        toast.error(t('myAccount.editProfileForm.updateFailed'))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleDeleteEducation = (schoolName: string) => {
    if (educationData?.length > 0) {
      const index = educationData.findIndex((e) => e.schoolName === schoolName)
      if (index !== -1) {
        educationData.splice(index, 1)
        setEducationData([...educationData])
      }
    }
  }

  const handleDeleteWork = (company: string) => {
    if (workData?.length > 0) {
      const index = workData.findIndex((e) => e.company === company)
      if (index !== -1) {
        workData.splice(index, 1)
        setWorkData([...workData])
      }
    }
  }

  useEffect(() => {
    if (dobLabelRef.current) {
      if (dob) {
        dobLabelRef.current.classList.remove('text-destructive')
        dobMessageRef.current?.classList.add('hidden')
      } else {
        dobLabelRef.current.classList.add('text-destructive')
        dobMessageRef.current?.classList.remove('hidden')
      }
    }
  }, [dob])

  return (
    <Form {...form}>
      {isLoading && <Loading />}
      <form onSubmit={form.handleSubmit(handleSaveChanges)}>
        <div className='relative block lg:flex justify-between items-start gap-4'>
          <Button type='submit' className='fixed bottom-4 right-4'>
            {t('myAccount.saveChanges')}
          </Button>
          <div className='lg:w-1/3 w-full'>
            <div className='border rounded-md text-center px-4 py-12'>
              <Label htmlFor='avatar'>
                <Avatar className='md:w-32 md:h-32 w-24 h-24 border m-auto hover:opacity-80 cursor-pointer'>
                  <AvatarImage src={avatar} />
                  <AvatarFallback />
                </Avatar>
              </Label>
              <input type='file' accept='image/*' id='avatar' onChange={handleSelectAvatar} className='hidden' />
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className='md:text-2xl text-lg font-bold mt-4 text-center' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className='text-base text-gray-500'>{t(userDetails?.rank ? userDetails?.rank : 'myAccount.noRank')}</p>
              <div className='flex justify-center items-center text-sm mt-12'>
                <div className='px-4'>
                  <p>{userDetails?.numberOfPosts ?? 0}</p>
                  <p className='text-gray-500'>{t('myAccount.posts')}</p>
                </div>
                <div className='border-x px-4'>
                  <p>{userDetails?.numberOfFriends ?? 0}</p>
                  <p className='text-gray-500'>{t('myAccount.friends')}</p>
                </div>
                <div className='px-4'>
                  <p>{userDetails?.points}</p>
                  <p className='text-gray-500'>{t('myAccount.points')}</p>
                </div>
              </div>
            </div>
            <div className='border rounded-md p-4 mt-4'>
              <p className='text-lg font-bold'>{t('myAccount.generalInformation')}</p>
              <div className='flex gap-2 mt-4'>
                <Mail />
                <p>{userDetails?.email ?? t('myAccount.noEmail')}</p>
              </div>
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem className='mt-2'>
                    <div className='flex items-center gap-2'>
                      <FormLabel className='text-nowrap font-semibold'>
                        <Phone />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem className='mt-4'>
                    <div className='flex items-center gap-2'>
                      <FormLabel className='text-nowrap font-semibold'>
                        <BookHeart />
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className='w-fit'>
                            <SelectValue placeholder={userDetails?.gender ?? t('myAccount.noGender')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='Male'>{t('gender.Male')}</SelectItem>
                          <SelectItem value='Female'>{t('gender.Female')}</SelectItem>
                          <SelectItem value='Other'>{t('gender.Other')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='mt-4'>
                <div className='flex items-center gap-2'>
                  <Label className='text-nowrap font-semibold' ref={dobLabelRef}>
                    <CalendarDays />
                  </Label>
                  <div className='max-w-44 border rounded-md shadow-sm'>
                    <DatePicker
                      popoverDirection='up'
                      asSingle={true}
                      useRange={false}
                      startFrom={dob ? new Date(dob) : new Date()}
                      placeholder={dob ? new Date(dob).toLocaleDateString('en-GB') : t('myAccount.noDateOfBirth')}
                      value={{ startDate: null, endDate: null }}
                      onChange={(newValue) => setDob(newValue?.startDate ?? null)}
                      displayFormat='DD/MM/YYYY'
                      maxDate={getValidYearForAgePicker()}
                    />
                  </div>
                </div>
                <p className='text-[0.8rem] font-medium text-destructive mt-2 hidden' ref={dobMessageRef}>
                  {t('myAccount.editProfileForm.dobRequired')}
                </p>
              </div>
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='mt-4'>
                    <div className='flex items-center gap-2'>
                      <FormLabel className='text-nowrap font-semibold'>
                        <MapPinHouse />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='border rounded-md p-4 mt-4'>
              <div className='flex justify-between'>
                <p className='text-lg font-bold'>{t('myAccount.education')}</p>
                <EducationDialog
                  triggerButton={<Button>{t('action.add')}</Button>}
                  educationData={educationData}
                  setEducationData={setEducationData}
                />
              </div>
              {educationData?.length > 0 ? (
                educationData?.map((education) => (
                  <div className='flex justify-between items-center mt-4' key={education.schoolName}>
                    <div className='flex-1'>
                      <div className='flex gap-2'>
                        <GraduationCap />
                        <p>{education.schoolName}</p>
                      </div>
                      <div className='mt-1 text-gray-500'>
                        <span>
                          {education.fromDate ? new Date(education.fromDate).toLocaleDateString('en-GB') : ''}
                        </span>{' '}
                        -{' '}
                        <span>
                          {education.untilNow
                            ? t('myAccount.untilNow')
                            : education.toDate
                              ? new Date(education.toDate).toLocaleDateString('en-GB')
                              : ''}
                        </span>
                      </div>
                    </div>
                    <div>
                      <EducationDialog
                        triggerButton={
                          <Button type='button' variant='secondary' size='sm'>
                            <Pencil size='16px' />
                          </Button>
                        }
                        education={education}
                        educationData={educationData}
                        setEducationData={setEducationData}
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        className='ml-2'
                        onClick={() => handleDeleteEducation(education.schoolName)}
                      >
                        <Trash2 size='16px' />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-gray-500'>{t('myAccount.noEducation')}</p>
              )}
            </div>
          </div>
          <div className='lg:w-2/3 w-full'>
            <div className='border rounded-md p-4 mt-4 lg:mt-0'>
              <FormField
                control={form.control}
                name='aboutMe'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-nowrap text-xl font-bold'>
                      {t('myAccount.editProfileForm.aboutMe')}
                    </FormLabel>
                    <FormControl>
                      <Textarea className='min-h-48 resize-none' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='border rounded-md p-4 mt-4'>
              <div className='flex justify-between'>
                <p className='text-lg font-bold'>{t('myAccount.work')}</p>
                <WorkDialog
                  triggerButton={<Button>{t('action.add')}</Button>}
                  workData={workData}
                  setWorkData={setWorkData}
                />
              </div>
              {workData?.length > 0 ? (
                workData.map((work, index) => (
                  <div className='flex justify-between items-center mt-4' key={index}>
                    <div className='flex-1'>
                      <div className='flex gap-2'>
                        <BriefcaseBusiness />
                        <p>{work.company}</p>
                      </div>
                      <p className='mt-1'>{work.profession}</p>
                      <div className='mt-1 text-gray-500'>
                        <span>{work.fromDate ? new Date(work.fromDate).toLocaleDateString('en-GB') : ''}</span> -{' '}
                        <span>
                          {work.untilNow
                            ? t('myAccount.untilNow')
                            : work.toDate
                              ? new Date(work.toDate).toLocaleDateString('en-GB')
                              : ''}
                        </span>
                      </div>
                      <p className='mt-1'>{work.description}</p>
                    </div>
                    <div>
                      <WorkDialog
                        triggerButton={
                          <Button type='button' variant='secondary' size='sm'>
                            <Pencil size='16px' />
                          </Button>
                        }
                        work={work}
                        workData={workData}
                        setWorkData={setWorkData}
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        className='ml-2'
                        onClick={() => handleDeleteWork(work.company)}
                      >
                        <Trash2 size='16px' />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-gray-500'>{t('myAccount.noWork')}</p>
              )}
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
