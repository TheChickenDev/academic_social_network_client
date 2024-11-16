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
import DatePicker from 'react-tailwindcss-datepicker'
import { useState, useRef, useEffect, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { GraduationCap } from 'lucide-react'
import { Education } from '@/types/user.type'
import { Checkbox } from '@/components/ui/checkbox'

export default function EducationDialog({
  triggerButton,
  education,
  educationData,
  setEducationData
}: {
  triggerButton: ReactElement<any, any>
  education?: Education
  educationData: Education[] | null
  setEducationData: (data: Education[]) => void
}) {
  const { t } = useTranslation()
  const [schoolName, setSchoolName] = useState<string>(education?.schoolName ?? '')
  const schoolNameLabelRef = useRef<HTMLLabelElement>(null)
  const schoolNameMessageRef = useRef<HTMLParagraphElement>(null)
  const [fromDate, setFromDate] = useState<Date | null>(education?.fromDate ?? null)
  const fromDateLabelRef = useRef<HTMLLabelElement>(null)
  const fromDateMessageRef = useRef<HTMLParagraphElement>(null)
  const [toDate, setToDate] = useState<Date | null>(education?.toDate ?? null)
  const toDateLabelRef = useRef<HTMLLabelElement>(null)
  const toDateMessageRef = useRef<HTMLParagraphElement>(null)
  const [untilNow, setUntilNow] = useState<boolean>(education?.untilNow ? true : false)
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    if (schoolNameLabelRef.current && schoolNameMessageRef.current) {
      if (schoolName && schoolName.length < 255) {
        schoolNameLabelRef.current.classList.remove('text-destructive')
        schoolNameMessageRef.current.classList.add('hidden')
      } else {
        schoolNameLabelRef.current.classList.add('text-destructive')
        schoolNameMessageRef.current.classList.remove('hidden')
      }
    }
  }, [schoolName])

  useEffect(() => {
    if (fromDateLabelRef.current && fromDateMessageRef.current) {
      if (fromDate) {
        fromDateLabelRef.current.classList.remove('text-destructive')
        fromDateMessageRef.current.classList.add('hidden')
      } else {
        fromDateLabelRef.current.classList.add('text-destructive')
        fromDateMessageRef.current.classList.remove('hidden')
      }
    }
  }, [fromDate])

  useEffect(() => {
    if (toDateLabelRef.current && toDateMessageRef.current) {
      if (toDate || untilNow) {
        toDateLabelRef.current.classList.remove('text-destructive')
        toDateMessageRef.current.classList.add('hidden')
      } else {
        toDateLabelRef.current.classList.add('text-destructive')
        toDateMessageRef.current.classList.remove('hidden')
      }
    }
  }, [toDate])

  useEffect(() => {
    if (untilNow) {
      toDateLabelRef?.current?.classList.remove('text-destructive')
      toDateMessageRef?.current?.classList.add('hidden')
      setToDate(null)
    }
  }, [untilNow])

  function handleSave() {
    let isValid = true
    if (!schoolName || schoolName.length >= 255) {
      if (schoolNameLabelRef.current) {
        schoolNameLabelRef.current.classList.add('text-destructive')
        schoolNameMessageRef.current?.classList.remove('hidden')
      }
      isValid = false
    }
    if (!fromDate) {
      if (fromDateLabelRef.current) {
        fromDateLabelRef.current.classList.add('text-destructive')
        fromDateMessageRef.current?.classList.remove('hidden')
      }
      isValid = false
    }
    if (!toDate && !untilNow) {
      if (toDateLabelRef.current) {
        toDateLabelRef.current.classList.add('text-destructive')
        toDateMessageRef.current?.classList.remove('hidden')
      }
      isValid = false
    }
    if (!isValid) {
      return
    }

    if (educationData?.length) {
      const existedIndex = educationData?.findIndex((e) => e.schoolName === education?.schoolName)
      if (existedIndex !== -1) {
        educationData[existedIndex] = {
          schoolName,
          fromDate: fromDate as Date,
          toDate: toDate as Date,
          untilNow,
          isPrivate: false
        }
      } else {
        educationData?.push({
          schoolName,
          fromDate: fromDate as Date,
          toDate: toDate as Date,
          untilNow,
          isPrivate: false
        })
      }
    } else {
      educationData?.push({
        schoolName,
        fromDate: fromDate as Date,
        toDate: toDate as Date,
        untilNow,
        isPrivate: false
      })
    }

    setEducationData(educationData ? [...educationData] : [])
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className='sm:max-w-[475px]'>
        <DialogHeader>
          <DialogTitle>
            <GraduationCap size='48px' />
          </DialogTitle>
          <DialogDescription>{t('myAccount.editProfileForm.updateDialogDescription')}</DialogDescription>
        </DialogHeader>
        <div>
          <div>
            <Label className='text-nowrap font-semibold' htmlFor='schoolName' ref={schoolNameLabelRef}>
              {t('myAccount.editProfileForm.schoolName')}
            </Label>
            <Input
              id='schoolName'
              className='mt-2'
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder={t('myAccount.editProfileForm.schoolName')}
            />
            <p className='text-[0.8rem] font-medium text-destructive mt-2 hidden' ref={schoolNameMessageRef}>
              {t('myAccount.editProfileForm.schoolNameMessage')}
            </p>
          </div>
          <div className='mt-4'>
            <Label className='text-nowrap font-semibold' ref={fromDateLabelRef}>
              {t('myAccount.editProfileForm.fromDate')}
            </Label>
            <div className='max-w-44 border rounded-md shadow-sm mt-2'>
              <DatePicker
                popoverDirection='up'
                asSingle={true}
                useRange={false}
                value={{ startDate: fromDate, endDate: fromDate }}
                onChange={(newValue) => setFromDate(newValue?.startDate ?? null)}
                displayFormat='DD/MM/YYYY'
                maxDate={new Date()}
              />
            </div>
            <p className='text-[0.8rem] font-medium text-destructive mt-2 hidden' ref={fromDateMessageRef}>
              {t('myAccount.editProfileForm.fromDateRequired')}
            </p>
          </div>
          <div className='mt-4'>
            <Label className='text-nowrap font-semibold' ref={toDateLabelRef}>
              {t('myAccount.editProfileForm.toDate')}
            </Label>
            <div className='max-w-44 border rounded-md shadow-sm mt-2'>
              <DatePicker
                disabled={untilNow}
                popoverDirection='up'
                asSingle={true}
                useRange={false}
                value={{ startDate: toDate, endDate: toDate }}
                onChange={(newValue) => setToDate(newValue?.startDate ?? null)}
                displayFormat='DD/MM/YYYY'
                maxDate={new Date()}
              />
            </div>
            <p className='text-[0.8rem] font-medium text-destructive mt-2 hidden' ref={toDateMessageRef}>
              {t('myAccount.editProfileForm.toDateRequired')}
            </p>
          </div>
          <div className='flex items-center space-x-2 mt-4'>
            <Checkbox id='untilNow' checked={untilNow} onCheckedChange={(value) => setUntilNow(!!value)} />
            <Label
              htmlFor='untilNow'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              {t('myAccount.untilNow')}
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
  )
}
