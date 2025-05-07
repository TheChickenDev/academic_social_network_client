import * as React from 'react'
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { ChevronDown, Eye, ArrowUpDown, CircleFadingPlus, ArrowLeft, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
import { createContest, getContests, updateContest } from '@/apis/contest.api'
import { ContestProblem, ContestProps } from '@/types/contest.type'
import { convertISODateToLocaleString } from '@/utils/utils'
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
import Datepicker from 'react-tailwindcss-datepicker'
import { AppContext } from '@/contexts/app.context'
import { Checkbox } from '@/components/ui/checkbox'
import { getProblems } from '@/apis/problem.api'

export function Contests() {
  const { userId } = React.useContext(AppContext)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [contests, setContests] = React.useState<ContestProps[]>([])
  const [selectedContest, setSelectedContest] = React.useState<ContestProps | null>(null)
  const [selectedProblems, setSelectedProblems] = React.useState<{ [key: number]: boolean }>({})
  const [problems, setProblems] = React.useState<ContestProblem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const { t } = useTranslation()

  const [title, setTitle] = React.useState<string>('')
  const titleLabelRef = React.useRef<HTMLLabelElement>(null)
  const titleMessageRef = React.useRef<HTMLParagraphElement>(null)
  const [startDate, setStartDate] = React.useState<Date | null>(null)
  const startDateLabelRef = React.useRef<HTMLLabelElement>(null)
  const startDateMessageRef = React.useRef<HTMLParagraphElement>(null)
  const [endDate, setEndDate] = React.useState<Date | null>(null)
  const endDateLabelRef = React.useRef<HTMLLabelElement>(null)
  const endDateMessageRef = React.useRef<HTMLParagraphElement>(null)
  const [description, setDescription] = React.useState<string>('')
  const [open, setOpen] = React.useState<boolean>(false)
  const [openProblems, setOpenProblems] = React.useState<boolean>(false)

  React.useEffect(() => {
    getContests({ page: 1, limit: 0 })
      .then((response) => {
        setContests(response.data.data)
      })
      .finally(() => setIsLoading(false))

    getProblems({ page: 1, limit: 0 })
      .then((response) => {
        setProblems(response.data.data)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const problemTable = useReactTable({
    data: problems,
    columns: [
      {
        accessorKey: 'title',
        header: t('admin.problem.title'),
        cell: ({ row }) => row.getValue('title')
      },
      {
        accessorKey: 'description',
        header: t('admin.problem.description'),
        cell: ({ row }) => row.getValue('description')
      },
      {
        accessorKey: 'difficulty',
        header: t('admin.problem.difficulty'),
        cell: ({ row }) => row.getValue('difficulty')
      },
      // {
      //   accessorKey: 'score',
      //   header: t('admin.problem.score'),
      //   cell: ({ row }) => row.getValue('score')
      // },
      // {
      //   accessorKey: 'order',
      //   header: t('admin.problem.order'),
      //   cell: ({ row }) => row.getValue('order')
      // },
      {
        id: 'select',
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
          />
        ),
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          const isSelectedA = rowA.getIsSelected() ? 1 : 0
          const isSelectedB = rowB.getIsSelected() ? 1 : 0
          return isSelectedA - isSelectedB // Sort by selection status
        },
        enableHiding: false
      }
    ],
    onSortingChange: setSorting,
    onRowSelectionChange: setSelectedProblems,
    state: {
      rowSelection: selectedProblems,
      sorting,
      columnFilters,
      columnVisibility
    },
    getCoreRowModel: getCoreRowModel()
  })

  const table = useReactTable({
    data: contests,
    columns: [
      // {
      //   id: 'select',
      //   header: ({ table }) => (
      //     <Checkbox
      //       checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
      //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      //       aria-label='Select all'
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <Checkbox
      //       checked={row.getIsSelected()}
      //       onCheckedChange={(value) => row.toggleSelected(!!value)}
      //       aria-label='Select row'
      //     />
      //   ),
      //   enableSorting: false,
      //   enableHiding: false
      // },
      {
        accessorKey: 'title',
        header: t('admin.contest.title'),
        cell: ({ row }) => row.getValue('title')
      },
      {
        accessorKey: 'description',
        header: t('admin.contest.description'),
        cell: ({ row }) => row.getValue('description')
      },
      {
        accessorKey: 'startDate',
        header: ({ column }) => {
          return (
            <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
              {t('admin.contest.startDate')}
              <ArrowUpDown size='20px' className='ml-1' />
            </Button>
          )
        },
        cell: ({ row }) => convertISODateToLocaleString(row.getValue('startDate'))
      },
      {
        accessorKey: 'endDate',
        header: ({ column }) => {
          return (
            <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
              {t('admin.contest.endDate')}
              <ArrowUpDown size='20px' className='ml-1' />
            </Button>
          )
        },
        cell: ({ row }) => convertISODateToLocaleString(row.getValue('endDate'))
      },
      // {
      //   accessorKey: 'createdBy',
      //   header: t('admin.contest.createdBy'),
      //   cell: ({ row }) => row.getValue('createdBy')
      // },
      {
        id: 'actions',
        header: t('admin.actions'),
        cell: ({ row }) => {
          const contest = row.original

          return (
            <div className='flex'>
              <Button
                variant='ghost'
                onClick={() => {
                  const selectionObject: { [key: number]: boolean } = {}
                  setSelectedProblems(() => {
                    problems.forEach((p, index) => {
                      const isSelected = (contest.problems ?? []).some((cp) => cp.problemId === p._id)
                      selectionObject[index] = isSelected
                    })

                    return selectionObject
                  })
                  setSelectedContest(contest)
                  setOpenProblems(true)
                }}
              >
                <Eye size='20px' />
              </Button>
            </div>
          )
        },
        enableHiding: false
      }
    ],
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  const handleSave = () => {
    let isValid = true
    if (!title || title.length >= 255) {
      if (titleLabelRef.current) {
        titleLabelRef.current.classList.add('text-destructive')
        titleMessageRef.current?.classList.remove('hidden')
      }
      isValid = false
    }
    if (!startDate) {
      if (startDateLabelRef.current) {
        startDateLabelRef.current.classList.add('text-destructive')
        startDateMessageRef.current?.classList.remove('hidden')
      }
      isValid = false
    }
    if (!endDate) {
      if (endDateLabelRef.current) {
        endDateLabelRef.current.classList.add('text-destructive')
        endDateMessageRef.current?.classList.remove('hidden')
      }
      isValid = false
    }
    if (!isValid) {
      return
    }

    createContest({
      title,
      problems: [
        {
          problemId: '646b3c5f7f1d3c001c4e9a2b',
          score: 100,
          order: 1
        }
      ],
      createdBy: userId ?? '',
      startDate: startDate ?? new Date(),
      endDate: endDate ?? new Date(),
      description
    })
      .then((response) => {
        setContests((prev) => [...prev, response.data.data])
        setOpen(false)
      })
      .catch((error) => {
        console.error('Error creating contest', error)
      })
  }

  const handleSaveProblems = () => {
    setIsLoading(true)
    const selectedProblemsArray = Object.keys(selectedProblems).filter((key) => selectedProblems[Number(key)])
    const selectedProblemsData = selectedProblemsArray.map((index) => {
      const problem = problems[Number(index)]
      return {
        problemId: problem._id,
        score: 100,
        order: Number(index) + 1
      }
    })

    updateContest({
      _id: selectedContest?._id,
      title: selectedContest?.title,
      description: selectedContest?.description,
      startDate: selectedContest?.startDate,
      endDate: selectedContest?.endDate,
      problems: selectedProblemsData,
      createdBy: selectedContest?.createdBy
    })
      .then((response) => {
        setContests((prev) =>
          prev.map((contest) => (contest._id === response.data.data._id ? response.data.data : contest))
        )
        setOpenProblems(false)
      })
      .catch((error) => {
        console.error('Error updating contest', error)
      })
      .finally(() => setIsLoading(false))

    setOpenProblems(false)
  }

  React.useEffect(() => {
    if (titleLabelRef.current && titleMessageRef.current) {
      if (title && title.length < 255) {
        titleLabelRef.current.classList.remove('text-destructive')
        titleMessageRef.current.classList.add('hidden')
      } else {
        titleLabelRef.current.classList.add('text-destructive')
        titleMessageRef.current.classList.remove('hidden')
      }
    }
  }, [title])

  React.useEffect(() => {
    if (startDateLabelRef.current && startDateMessageRef.current) {
      if (startDate) {
        startDateLabelRef.current.classList.remove('text-destructive')
        startDateMessageRef.current.classList.add('hidden')
      } else {
        startDateLabelRef.current.classList.add('text-destructive')
        startDateMessageRef.current.classList.remove('hidden')
      }
    }
  }, [startDate])

  React.useEffect(() => {
    if (endDateLabelRef.current && endDateMessageRef.current) {
      if (endDate) {
        endDateLabelRef.current.classList.remove('text-destructive')
        endDateMessageRef.current.classList.add('hidden')
      } else {
        endDateLabelRef.current.classList.add('text-destructive')
        endDateMessageRef.current.classList.remove('hidden')
      }
    }
  }, [endDate])

  if (isLoading) return <Loading />

  if (openProblems)
    return (
      <div>
        <div className='flex space-x-2 mb-2'>
          <Button onClick={() => setOpenProblems(false)} variant='outline'>
            <ArrowLeft />
          </Button>
          <Button onClick={handleSaveProblems} variant='outline'>
            <Save />
          </Button>
        </div>
        <Table>
          <TableHeader>
            {problemTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {problemTable.getRowModel().rows?.length ? (
              problemTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className='h-24 text-center'>
                  {t('admin.noDataAvailable')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )

  return (
    <div className='w-full'>
      <div className='flex items-center justify-end py-4'>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant='outline'>{t('admin.contest.createContest')}</Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[475px]'>
            <DialogHeader>
              <DialogTitle>
                <CircleFadingPlus size='48px' />
              </DialogTitle>
              <DialogDescription>{t('admin.contest.createContestDescription')}</DialogDescription>
            </DialogHeader>
            <div>
              <div>
                <Label className='text-nowrap font-semibold' htmlFor='title' ref={titleLabelRef}>
                  {t('admin.contest.title')}
                </Label>
                <Input
                  id='title'
                  className='mt-2'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('admin.contest.title')}
                />
                <p className='text-[0.8rem] font-medium text-destructive mt-2 hidden' ref={titleMessageRef}>
                  {t('admin.contest.titleMessage')}
                </p>
              </div>
              <div className='mt-4'>
                <Label className='text-nowrap font-semibold' ref={startDateLabelRef}>
                  {t('admin.contest.startDate')}
                </Label>
                <div className='max-w-44 border rounded-md shadow-sm mt-2'>
                  <Datepicker
                    popoverDirection='up'
                    asSingle={true}
                    useRange={false}
                    value={{ startDate: startDate, endDate: startDate }}
                    onChange={(newValue) => setStartDate(newValue?.startDate ?? null)}
                    displayFormat='DD/MM/YYYY'
                    maxDate={new Date()}
                  />
                </div>
                <p className='text-[0.8rem] font-medium text-destructive mt-2 hidden' ref={startDateMessageRef}>
                  {t('admin.contest.startDateRequired')}
                </p>
              </div>
              <div className='mt-4'>
                <Label className='text-nowrap font-semibold' ref={endDateLabelRef}>
                  {t('admin.contest.endDate')}
                </Label>
                <div className='max-w-44 border rounded-md shadow-sm mt-2'>
                  <Datepicker
                    popoverDirection='up'
                    asSingle={true}
                    useRange={false}
                    value={{ startDate: endDate, endDate: endDate }}
                    onChange={(newValue) => setEndDate(newValue?.startDate ?? null)}
                    displayFormat='DD/MM/YYYY'
                    // maxDate={new Date()}
                    minDate={startDate ?? new Date()}
                  />
                </div>
                <p className='text-[0.8rem] font-medium text-destructive mt-2 hidden' ref={endDateMessageRef}>
                  {t('admin.contest.endDateRequired')}
                </p>
              </div>
              <div className='mt-4'>
                <Label className='text-nowrap font-semibold' htmlFor='description'>
                  {t('admin.contest.description')}
                </Label>
                <Input
                  id='description'
                  className='mt-2'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('admin.contest.description')}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} type='button'>
                {t('action.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {!contests?.length ? (
        <div className='flex flex-col items-center justify-center h-full py-10 flex-1'>
          <svg
            className='w-16 h-16 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M3 15a4 4 0 004 4h10a4 4 0 004-4M3 15a4 4 0 014-4h10a4 4 0 014 4M3 15V9a4 4 0 014-4h10a4 4 0 014 4v6M3 9a4 4 0 014-4h10a4 4 0 014 4v6'
            />
          </svg>
          <h2 className='mt-4 text-xl font-semibold text-gray-700'>{t('admin.noDataAvailable')}</h2>
          <p className='mt-2 text-gray-500'>{t('noDataDescription')}</p>
        </div>
      ) : (
        <>
          <div className='flex items-center py-4'>
            <Input
              placeholder={t('admin.filterTitle')}
              value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
              onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
              className='max-w-sm'
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='ml-auto'>
                  {t('admin.columns')} <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className='capitalize'
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={contests?.length} className='h-24 text-center'>
                      {t('admin.noDataAvailable')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className='text-center space-x-2 py-4'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {t('admin.previous')}
            </Button>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              {t('admin.next')}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
