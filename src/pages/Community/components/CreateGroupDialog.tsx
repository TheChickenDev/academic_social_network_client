import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState, useRef, useEffect, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'
import Loading from '@/components/Loading'
import { createGroup } from '@/apis/group.api'
import { AppContext } from '@/contexts/app.context'
import { useNavigate } from 'react-router-dom'
import paths from '@/constants/paths'
import { Checkbox } from '@/components/ui/checkbox'

export default function CreateGroupDialog() {
  const { t } = useTranslation()
  const [groupName, setGroupName] = useState<string>('')
  const groupNameLabelRef = useRef<HTMLLabelElement>(null)
  const groupNameMessageRef = useRef<HTMLParagraphElement>(null)
  const [description, setDescription] = useState<string>('')
  const descriptionLabelRef = useRef<HTMLLabelElement>(null)
  const descriptionMessageRef = useRef<HTMLParagraphElement>(null)
  const [isPrivate, setIsPrivate] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { userId } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (groupNameLabelRef.current && groupNameMessageRef.current) {
      if (groupName && groupName.length < 255) {
        groupNameLabelRef.current.classList.remove('text-destructive')
        groupNameMessageRef.current.classList.add('hidden')
      } else {
        groupNameLabelRef.current.classList.add('text-destructive')
        groupNameMessageRef.current.classList.remove('hidden')
      }
    }
  }, [groupName])

  useEffect(() => {
    if (descriptionLabelRef.current && descriptionMessageRef.current) {
      if (description && description.length < 255) {
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
    if (!groupName || groupName.length >= 255) {
      if (groupNameLabelRef.current) {
        groupNameLabelRef.current.classList.add('text-destructive')
        groupNameMessageRef.current?.classList.remove('hidden')
      }
      isValid = false
    }

    if (!description || description.length >= 255) {
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
    createGroup({ name: groupName, description, ownerId: userId ?? '', isPrivate })
      .then((response) => {
        const status = response.status
        if (status === 201) {
          navigate(paths.groupDetails.replace(':id', response.data.data._id ?? ''))
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <>
      {isLoading && <Loading />}
      <Dialog>
        <DialogTrigger asChild>
          <Button>{t('community.createAGroup')}</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[475px]'>
          <DialogHeader>
            <DialogTitle>
              <Users size='48px' />
            </DialogTitle>
            <DialogDescription>{t('community.createAGroupDescription')}</DialogDescription>
          </DialogHeader>
          <div>
            <div>
              <Label className='text-nowrap font-semibold' htmlFor='groupName' ref={groupNameLabelRef}>
                {t('community.groupName')}
              </Label>
              <Input
                id='groupName'
                className='mt-2'
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder={t('community.groupName')}
              />
              <p className='text-[0.8rem] font-medium text-destructive mt-2 hidden' ref={groupNameMessageRef}>
                {t('community.groupNameMessage')}
              </p>
            </div>
            <div className='mt-4'>
              <Label className='text-nowrap font-semibold' htmlFor='description' ref={descriptionLabelRef}>
                {t('community.groupDescription')}
              </Label>
              <Input
                id='description'
                className='mt-2'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('community.groupDescription')}
              />
              <p className='text-[0.8rem] font-medium text-destructive mt-2 hidden' ref={descriptionMessageRef}>
                {t('community.groupDescriptionMessage')}
              </p>
            </div>
            <div className='flex items-center space-x-2 mt-4'>
              <Checkbox id='isPrivate' checked={isPrivate} onCheckedChange={(value) => setIsPrivate(!!value)} />
              <Label
                htmlFor='isPrivate'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                {t('group.isPrivate')}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} type='button'>
              {t('action.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
