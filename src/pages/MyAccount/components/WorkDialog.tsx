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
import { Job } from '@/types/user.type'
import { Checkbox } from '@/components/ui/checkbox'

export default function WorkDialog({
  triggerButton,
  work,
  workData,
  setWorkData
}: {
  triggerButton: ReactElement<any, any>
  work?: Job
  workData: Job[] | null
  setWorkData: (data: Job[]) => void
}) {
  const { t } = useTranslation()
  const [company, setCompany] = useState<string>(work?.company ?? '')
  const companyLabelRef = useRef<HTMLLabelElement>(null)
  const companyMessageRef = useRef<HTMLParagraphElement>(null)
  const [profession, setProfession] = useState<string>(work?.profession ?? '')
  const professionLabelRef = useRef<HTMLLabelElement>(null)
  const professionMessageRef = useRef<HTMLParagraphElement>(null)
  const [description, setDescription] = useState<string>(work?.description ?? '')
  const descriptionLabelRef = useRef<HTMLLabelElement>(null)
  const descriptionMessageRef = useRef<HTMLParagraphElement>(null)
  const [fromDate, setFromDate] = useState<Date | null>(work?.fromDate ?? null)
  const fromDateLabelRef = useRef<HTMLLabelElement>(null)
  const fromDateMessageRef = useRef<HTMLParagraphElement>(null)
  const [toDate, setToDate] = useState<Date | null>(work?.toDate ?? null)
  const toDateLabelRef = useRef<HTMLLabelElement>(null)
  const toDateMessageRef = useRef<HTMLParagraphElement>(null)
  const [untilNow, setUntilNow] = useState<boolean>(work?.untilNow ? true : false)
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    if (companyLabelRef.current && companyMessageRef.current) {
      if (company && company.length < 255) {
        companyLabelRef.current.classList.remove('text-destructive')
        companyMessageRef.current.classList.add('hidden')
      } else {
        companyLabelRef.current.classList.add('text-destructive')
        companyMessageRef.current.classList.remove('hidden')
      }
    }
  }, [company])

  useEffect(() => {
    if (professionLabelRef.current && professionMessageRef.current) {
      if (profession) {
        professionLabelRef.current.classList.remove('text-destructive')
        professionMessageRef.current.classList.add('hidden')
      } else {
        professionLabelRef.current.classList.add('text-destructive')
        professionMessageRef.current.classList.remove('hidden')
      }
    }
  }, [profession])

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
    if (!company || company.length >= 255) {
      if (companyLabelRef.current) {
        companyLabelRef.current.classList.add('text-destructive')
        companyMessageRef.current?.classList.remove('hidden')
      }
      isValid = false
    }
    if (!profession) {
      if (professionLabelRef.current) {
        professionLabelRef.current.classList.add('text-destructive')
        professionMessageRef.current?.classList.remove('hidden')
      }
      isValid = false
    }
    if (!description) {
      if (descriptionLabelRef.current) {
        descriptionLabelRef.current.classList.add('text-destructive')
        descriptionMessageRef.current?.classList.remove('hidden')
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

    if (workData?.length) {
      const existedIndex = workData?.findIndex((e) => e.company === work?.company)
      if (existedIndex !== -1) {
        workData[existedIndex] = {
          company,
          profession,
          description,
          fromDate: fromDate as Date,
          toDate: toDate as Date,
          untilNow,
          isPrivate: false
        }
      } else {
        workData?.push({
          company,
          profession,
          description,
          fromDate: fromDate as Date,
          toDate: toDate as Date,
          untilNow,
          isPrivate: false
        })
      }
    } else {
      workData?.push({
        company,
        profession,
        description,
        fromDate: fromDate as Date,
        toDate: toDate as Date,
        untilNow,
        isPrivate: false
      })
    }

    setWorkData(workData ? [...workData] : [])
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
            <Label className='text-nowrap font-semibold' htmlFor='company' ref={companyLabelRef}>
              {t('myAccount.editProfileForm.company')}
            </Label>
            <Input
              id='company'
              className='mt-1'
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={t('myAccount.editProfileForm.company')}
            />
            <p className='text-[0.8rem] font-medium text-destructive mt-1 hidden' ref={companyMessageRef}>
              {t('myAccount.editProfileForm.companyMessage')}
            </p>
          </div>
          <div className='mt-1'>
            <Label className='text-nowrap font-semibold' htmlFor='profession' ref={professionLabelRef}>
              {t('myAccount.editProfileForm.profession')}
            </Label>
            <Input
              id='profession'
              className='mt-1'
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder={t('myAccount.editProfileForm.profession')}
            />
            <p className='text-[0.8rem] font-medium text-destructive mt-1 hidden' ref={professionMessageRef}>
              {t('myAccount.editProfileForm.professionMessage')}
            </p>
          </div>
          <div className='mt-1'>
            <Label className='text-nowrap font-semibold' htmlFor='description' ref={descriptionLabelRef}>
              {t('myAccount.editProfileForm.companyDescription')}
            </Label>
            <Input
              id='description'
              className='mt-1'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('myAccount.editProfileForm.companyDescription')}
            />
            <p className='text-[0.8rem] font-medium text-destructive mt-1 hidden' ref={descriptionMessageRef}>
              {t('myAccount.editProfileForm.companyDescriptionMessage')}
            </p>
          </div>
          <div className='mt-1'>
            <Label className='text-nowrap font-semibold' ref={fromDateLabelRef}>
              {t('myAccount.editProfileForm.fromDate')}
            </Label>
            <div className='max-w-44 border rounded-md shadow-sm mt-1'>
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
            <p className='text-[0.8rem] font-medium text-destructive mt-1 hidden' ref={fromDateMessageRef}>
              {t('myAccount.editProfileForm.fromDateRequired')}
            </p>
          </div>
          <div className='mt-1'>
            <Label className='text-nowrap font-semibold' ref={toDateLabelRef}>
              {t('myAccount.editProfileForm.toDate')}
            </Label>
            <div className='max-w-44 border rounded-md shadow-sm mt-1'>
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
            <p className='text-[0.8rem] font-medium text-destructive mt-1 hidden' ref={toDateMessageRef}>
              {t('myAccount.editProfileForm.toDateRequired')}
            </p>
          </div>
          <div className='flex items-center space-x-2 mt-1'>
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
