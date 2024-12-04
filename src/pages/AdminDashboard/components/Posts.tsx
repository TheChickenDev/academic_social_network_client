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
import { ChevronDown, Eye, Trash2, ArrowUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
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
import paths from '@/constants/paths'
import { deletePost } from '@/apis/post.api'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Loading from '@/components/Loading'
import { getPosts } from '@/apis/post.api'
import { PostProps } from '@/types/post.type'

export function Posts() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [posts, setUsers] = React.useState<PostProps[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const { t } = useTranslation()
  const navigate = useNavigate()

  React.useEffect(() => {
    getPosts({ page: 1, limit: 0 })
      .then((response) => setUsers(response.data.data))
      .finally(() => setIsLoading(false))
  }, [])

  const handleDeleteUser = (id: string) => {
    setIsLoading(true)
    deletePost(id)
      .then(() => {
        setUsers(posts.filter((post) => post._id !== id))
      })
      .finally(() => setIsLoading(false))
  }

  const table = useReactTable({
    data: posts,
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
        header: ({ column }) => {
          return (
            <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
              {t('admin.title')}
              <ArrowUpDown size='20px' className='ml-1' />
            </Button>
          )
        },
        cell: ({ row }) => row.getValue('title')
      },
      {
        accessorKey: 'updatedAt',
        header: ({ column }) => {
          return (
            <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
              {t('admin.updatedAt')}
              <ArrowUpDown size='20px' className='ml-1' />
            </Button>
          )
        },
        cell: ({ row }) => row.getValue('updatedAt')
      },
      {
        accessorKey: 'ownerName',
        header: t('admin.owner'),
        cell: ({ row }) => row.getValue('ownerName')
      },
      {
        accessorKey: 'ownerEmail',
        header: t('admin.ownerEmail'),
        cell: ({ row }) => row.getValue('ownerEmail')
      },
      {
        id: 'actions',
        header: t('admin.actions'),
        cell: ({ row }) => {
          const post = row.original

          return (
            <div className='flex'>
              <Button variant='ghost' onClick={() => post._id && navigate(paths.postDetails.replace(':id', post._id))}>
                <Eye size='20px' />
              </Button>
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
                    <AlertDialogAction onClick={() => post._id && handleDeleteUser(post._id)}>
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

  if (isLoading) return <Loading />

  if (!posts.length)
    return (
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
    )

  return (
    <div className='w-full'>
      <div className='flex items-center py-4'>
        <Input
          placeholder={t('admin.filterTitle')}
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        <Input
          placeholder={t('admin.filterOwner')}
          value={(table.getColumn('ownerName')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('ownerName')?.setFilterValue(event.target.value)}
          className='max-w-sm ml-2'
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
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                <TableCell colSpan={posts.length} className='h-24 text-center'>
                  {t('admin.noDataAvailable')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='text-center space-x-2 py-4'>
        <Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {t('admin.previous')}
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {t('admin.next')}
        </Button>
      </div>
    </div>
  )
}
