import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState, ChangeEvent, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { GroupProps } from '@/types/group.type'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Loading from '@/components/Loading'
import { updateGroup } from '@/apis/group.api'
import { toast } from 'sonner'

interface EditInformationFormProps {
  groupDetails: GroupProps | null
  setGroupDetails: React.Dispatch<React.SetStateAction<GroupProps | null>>
}

export default function EditInformationForm({ groupDetails, setGroupDetails }: EditInformationFormProps) {
  const { t } = useTranslation()
  const [name, setName] = useState<string>(groupDetails?.name ?? '')
  const nameLabelRef = useRef<HTMLLabelElement>(null)
  const nameMessageRef = useRef<HTMLParagraphElement>(null)
  const [description, setDescription] = useState<string>(groupDetails?.description ?? '')
  const descriptionLabelRef = useRef<HTMLLabelElement>(null)
  const descriptionMessageRef = useRef<HTMLParagraphElement>(null)
  const [avatar, setAvatar] = useState<string>(groupDetails?.avatarImg ?? '')
  const [isPrivate, setIsPrivate] = useState<boolean>(groupDetails?.isPrivate ? true : false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (nameLabelRef.current && nameMessageRef.current) {
      if (name && name.length < 255) {
        nameLabelRef.current.classList.remove('text-destructive')
        nameMessageRef.current.classList.add('hidden')
      } else {
        nameLabelRef.current.classList.add('text-destructive')
        nameMessageRef.current.classList.remove('hidden')
      }
    }
  }, [name])

  useEffect(() => {
    if (descriptionLabelRef.current && descriptionMessageRef.current) {
      if (description) {
        descriptionLabelRef.current.classList.remove('text-destructive')
        descriptionMessageRef.current.classList.add('hidden')
      } else {
        descriptionLabelRef.current.classList.add('text-destructive')
        descriptionMessageRef.current.classList.remove('hidden')
      }
    }
  }, [description])

  function handleSave() {
    let isValid = true
    if (!name || name.length >= 255) {
      if (nameLabelRef.current) {
        nameLabelRef.current.classList.add('text-destructive')
        nameMessageRef.current?.classList.remove('hidden')
      }
      isValid = false
    }
    if (!description || description.length > 2000 || description.length < 20) {
      if (descriptionLabelRef.current) {
        descriptionLabelRef.current.classList.add('text-destructive')
        descriptionMessageRef.current?.classList.remove('hidden')
      }
      isValid = false
    }
    if (!isValid) {
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('id', groupDetails?._id ?? '')
    formData.append('name', name)
    formData.append('description', description)
    formData.append('isPrivate', isPrivate.toString())
    const files = (document.getElementById('avatar') as HTMLInputElement).files
    if (files && files.length > 0) {
      console.log(files)
      formData.append('images', files[0])
    }

    updateGroup(formData)
      .then((response) => {
        const status = response.status
        if (status === 200) {
          toast.success(t('group.updateSuccessful'))
          setGroupDetails(response.data.data)
        }
      })
      .catch(() => {
        toast.error(t('group.updateFailed'))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

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

  return (
    <div>
      {isLoading && <Loading />}
      <Button onClick={handleSave} className='fixed bottom-4 right-4'>
        {t('myAccount.saveChanges')}
      </Button>
      <Label htmlFor='avatar' className='w-fit block m-auto'>
        <Avatar className='md:w-32 md:h-32 w-24 h-24 border m-auto hover:opacity-80 cursor-pointer'>
          <AvatarImage src={avatar} />
          <AvatarFallback />
        </Avatar>
      </Label>
      <input type='file' accept='image/*' id='avatar' onChange={handleSelectAvatar} className='hidden' />
      <div>
        <Label className='text-nowrap font-semibold' htmlFor='name' ref={nameLabelRef}>
          {t('myAccount.editProfileForm.name')}
        </Label>
        <Input
          id='name'
          className='mt-2'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('group.name')}
        />
        <p className='text-[0.8rem] font-medium text-destructive mt-1 hidden' ref={nameMessageRef}>
          {t('group.nameError')}
        </p>
      </div>
      <div className='mt-4'>
        <Label className='text-nowrap font-semibold' htmlFor='description' ref={descriptionLabelRef}>
          {t('group.description')}
        </Label>
        <Input
          id='description'
          className='mt-2'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('group.description')}
        />
        <p className='text-[0.8rem] font-medium text-destructive mt-1 hidden' ref={descriptionMessageRef}>
          {t('group.descriptionError')}
        </p>
      </div>
      <div className='flex items-center space-x-2 mt-4'>
        <Checkbox id='untilNow' checked={isPrivate} onCheckedChange={(value) => setIsPrivate(!!value)} />
        <Label
          htmlFor='untilNow'
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          {t('group.isPrivate')}
        </Label>
      </div>
    </div>
  )
}
