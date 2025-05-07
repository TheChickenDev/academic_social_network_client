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
import { ChevronDown, Eye, CircleFadingPlus, ArrowLeft, Trash2, Save } from 'lucide-react'

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
import { ContestProblem } from '@/types/contest.type'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { createProblem, getProblems, updateProblem } from '@/apis/problem.api'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { AppContext } from '@/contexts/app.context'

export function Problems() {
  const { userId } = React.useContext(AppContext)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [problems, setProblems] = React.useState<ContestProblem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const { t } = useTranslation()

  const [title, setTitle] = React.useState<string>('')
  const titleLabelRef = React.useRef<HTMLLabelElement>(null)
  const titleMessageRef = React.useRef<HTMLParagraphElement>(null)
  const [description, setDescription] = React.useState<string>('')
  const descriptionLabelRef = React.useRef<HTMLLabelElement>(null)
  const descriptionMessageRef = React.useRef<HTMLParagraphElement>(null)
  const [difficulty, setDifficulty] = React.useState<'easy' | 'medium' | 'hard'>('easy')
  const difficultyLabelRef = React.useRef<HTMLLabelElement>(null)
  const [testCases, setTestCases] = React.useState<Array<{ input: string; output: string; _id: number }>>([])
  const [testCaseInput, setTestCaseInput] = React.useState<string>('')
  const testCaseInputMessageRef = React.useRef<HTMLParagraphElement>(null)
  const [testCaseOutput, setTestCaseOutput] = React.useState<string>('')
  const testCaseOutputMessageRef = React.useRef<HTMLParagraphElement>(null)
  const [selectedProblem, setSelectedProblem] = React.useState<ContestProblem>({} as ContestProblem)

  const [open, setOpen] = React.useState<boolean>(false)
  const [openTestcases, setOpenTestcases] = React.useState<boolean>(false)

  React.useEffect(() => {
    getProblems({ page: 1, limit: 0 })
      .then((response) => {
        setProblems(response.data.data)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const testCaseTable = useReactTable({
    data: testCases,
    columns: [
      {
        accessorKey: 'input',
        header: t('admin.problem.input')
      },
      {
        accessorKey: 'output',
        header: t('admin.problem.output')
      },
      {
        id: 'actions',
        header: t('admin.actions'),
        cell: ({ row }) => {
          const tc = row.original

          return (
            <div className='flex'>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant='ghost'>
                    <Trash2 size='20px' />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('alertDialog.message')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('alertDialog.description')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('action.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setTestCases((prev) => prev.filter((item) => item._id !== tc._id))
                      }}
                    >
                      {t('action.confirm')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )
        },
        enableHiding: false
      }
    ],
    getCoreRowModel: getCoreRowModel()
  })

  const table = useReactTable({
    data: problems,
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
      //   accessorKey: 'createdBy',
      //   header: t('admin.problem.createdBy'),
      //   cell: ({ row }) => row.getValue('createdBy')
      // },
      {
        id: 'actions',
        header: t('admin.actions'),
        cell: ({ row }) => {
          const problem = row.original

          return (
            <div className='flex'>
              <Button
                variant='ghost'
                onClick={() => {
                  setTestCases(
                    (problem.testCases ?? []).map((testCase, index) => ({
                      ...testCase,
                      _id: index
                    }))
                  )
                  if (problem._id) {
                    setSelectedProblem(problem)
                  }
                  setOpenTestcases(true)
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
    if (!description) {
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

    createProblem({
      title,
      description,
      difficulty,
      createdBy: userId ?? ''
    })
      .then((response) => {
        setProblems((prev) => [response.data.data, ...prev])
        setOpen(false)
      })
      .catch((error) => {
        console.error('Error creating contest', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleAddTestCase = () => {
    let isValid = true
    if (!testCaseInput) {
      if (testCaseInputMessageRef.current) {
        testCaseInputMessageRef.current.classList.remove('hidden')
        isValid = false
      }
    }
    if (!testCaseOutput) {
      if (testCaseOutputMessageRef.current) {
        testCaseOutputMessageRef.current.classList.remove('hidden')
        isValid = false
      }
    }
    if (!isValid) {
      return
    }
    setTestCases((prev) => [{ input: testCaseInput, output: testCaseOutput, _id: prev?.length ?? 1 }, ...prev])
    setTestCaseInput('')
    setTestCaseOutput('')
  }

  const handleSaveTestCases = () => {
    setIsLoading(true)
    updateProblem({
      _id: selectedProblem._id,
      testCases: testCases.map((testCase) => ({ input: testCase.input, output: testCase.output })),
      title: selectedProblem.title,
      description: selectedProblem.description,
      difficulty: selectedProblem.difficulty,
      createdBy: selectedProblem.createdBy
    })
      .then((response) => {
        setProblems((prev) =>
          prev.map((problem) => (problem._id === response.data.data._id ? response.data.data : problem))
        )
        setOpenTestcases(false)
      })
      .catch((error) => {
        console.error('Error updating test cases', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
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
    if (testCaseInputMessageRef.current) {
      if (testCaseInput) {
        testCaseInputMessageRef.current.classList.add('hidden')
      } else {
        testCaseInputMessageRef.current.classList.remove('hidden')
      }
    }
  }, [testCaseInput])

  React.useEffect(() => {
    if (testCaseOutputMessageRef.current) {
      if (testCaseOutput) {
        testCaseOutputMessageRef.current.classList.add('hidden')
      } else {
        testCaseOutputMessageRef.current.classList.remove('hidden')
      }
    }
  }, [testCaseOutput])

  React.useEffect(() => {
    if (titleLabelRef.current && descriptionMessageRef.current) {
      if (description && description.length < 255) {
        descriptionLabelRef.current?.classList.remove('text-destructive')
        descriptionMessageRef.current.classList.add('hidden')
      } else {
        descriptionLabelRef.current?.classList.add('text-destructive')
        descriptionMessageRef.current.classList.remove('hidden')
      }
    }
  }, [description])

  if (isLoading) return <Loading />

  if (openTestcases)
    return (
      <div>
        <div className='flex space-x-2'>
          <Button onClick={() => setOpenTestcases(false)} variant='outline'>
            <ArrowLeft />
          </Button>
          <Button onClick={handleSaveTestCases}>
            <Save />
          </Button>
        </div>
        <div className='flex space-x-2 my-2'>
          <div>
            <Textarea
              id='input'
              value={testCaseInput}
              onChange={(e) => setTestCaseInput(e.target.value)}
              placeholder={t('admin.problem.input')}
            />
            <p className='text-[0.8rem] font-medium text-destructive mt-2 hidden' ref={testCaseInputMessageRef}>
              {t('admin.problem.inputMessage')}
            </p>
          </div>
          <div>
            <Textarea
              id='output'
              value={testCaseOutput}
              onChange={(e) => setTestCaseOutput(e.target.value)}
              placeholder={t('admin.problem.output')}
            />
            <p className='text-[0.8rem] font-medium text-destructive mt-2 hidden' ref={testCaseOutputMessageRef}>
              {t('admin.problem.outputMessage')}
            </p>
          </div>
          <Button onClick={handleAddTestCase}>{t('admin.problem.addTestcase')}</Button>
        </div>
        <Table>
          <TableHeader>
            {testCaseTable.getHeaderGroups().map((headerGroup) => (
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
            {testCaseTable.getRowModel().rows?.length ? (
              testCaseTable.getRowModel().rows.map((row) => (
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
            <Button variant='outline'>{t('admin.problem.createProblem')}</Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[475px]'>
            <DialogHeader>
              <DialogTitle>
                <CircleFadingPlus size='48px' />
              </DialogTitle>
              <DialogDescription>{t('admin.problem.createProblemDescription')}</DialogDescription>
            </DialogHeader>
            <div>
              <div>
                <Label className='text-nowrap font-semibold' htmlFor='title' ref={titleLabelRef}>
                  {t('admin.problem.title')}
                </Label>
                <Input
                  id='title'
                  className='mt-2'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('admin.problem.title')}
                />
                <p className='text-[0.8rem] font-medium text-destructive mt-2 hidden' ref={titleMessageRef}>
                  {t('admin.problem.titleMessage')}
                </p>
              </div>
              <div className='mt-4'>
                <Label className='text-nowrap font-semibold' htmlFor='description' ref={descriptionLabelRef}>
                  {t('admin.problem.description')}
                </Label>
                <Textarea
                  id='description'
                  className='mt-2'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('admin.problem.description')}
                />

                <p className='text-[0.8rem] font-medium text-destructive mt-2 hidden' ref={descriptionMessageRef}>
                  {t('admin.problem.descriptionRequired')}
                </p>
              </div>
              <div className='mt-4'>
                <Label className='text-nowrap font-semibold' htmlFor='difficulty' ref={difficultyLabelRef}>
                  {t('admin.problem.difficulty')}
                </Label>
                <RadioGroup
                  className='flex justify-between'
                  defaultValue={difficulty}
                  onValueChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}
                >
                  <div className='flex items-center space-x-2 mt-2'>
                    <RadioGroupItem value='easy' id='r1' />
                    <Label htmlFor='r1'>Easy</Label>
                  </div>
                  <div className='flex items-center space-x-2 mt-2'>
                    <RadioGroupItem value='medium' id='r2' />
                    <Label htmlFor='r2'>Medium</Label>
                  </div>
                  <div className='flex items-center space-x-2 mt-2'>
                    <RadioGroupItem value='hard' id='r3' />
                    <Label htmlFor='r3'>Hard</Label>
                  </div>
                </RadioGroup>
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
      {!problems?.length ? (
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
                    <TableCell colSpan={problems?.length} className='h-24 text-center'>
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
