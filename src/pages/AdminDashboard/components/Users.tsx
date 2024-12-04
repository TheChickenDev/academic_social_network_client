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
import { deleteUser } from '@/apis/user.api'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { User } from '@/types/user.type'
import { getUsers } from '@/apis/user.api'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export function Users() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [users, setUsers] = React.useState<User[]>([])
  const { t } = useTranslation()
  const navigate = useNavigate()

  React.useEffect(() => {
    getUsers({ page: 1, limit: 0 }).then((response) => setUsers(response.data.data))
  }, [])

  const handleDeleteUser = (id: string) => {
    deleteUser(id).then(() => {
      setUsers(users.filter((user) => user._id !== id))
    })
  }

  const table = useReactTable({
    data: users,
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
        accessorKey: 'email',
        header: ({ column }) => {
          return (
            <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
              Email
              <ArrowUpDown size='20px' className='ml-1' />
            </Button>
          )
        },
        cell: ({ row }) => row.getValue('email')
      },
      {
        accessorKey: 'fullName',
        header: ({ column }) => {
          return (
            <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
              {t('admin.fullName')}
              <ArrowUpDown size='20px' className='ml-1' />
            </Button>
          )
        },
        cell: ({ row }) => row.getValue('fullName')
      },
      {
        accessorKey: 'dateOfBirth',
        header: t('admin.dateOfBirth'),
        cell: ({ row }) => row.getValue('dateOfBirth')
      },
      {
        accessorKey: 'gender',
        header: t('admin.gender'),
        cell: ({ row }) => row.getValue('gender')
      },
      {
        accessorKey: 'points',
        header: ({ column }) => {
          return (
            <Button
              className='p-0'
              variant='ghost'
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {t('admin.points')}
              <ArrowUpDown size='20px' className='ml-1' />
            </Button>
          )
        },
        cell: ({ row }) => row.getValue('points')
      },
      {
        accessorKey: 'rank',
        header: t('admin.rank'),
        cell: ({ row }) => row.getValue('rank')
      },
      {
        id: 'actions',
        header: t('admin.actions'),
        cell: ({ row }) => {
          const user = row.original

          return (
            <div className='flex'>
              <Button variant='ghost' onClick={() => navigate(paths.profile.replace(':id', user._id))}>
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
                    <AlertDialogAction onClick={() => handleDeleteUser(user._id)}>
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

  if (!users.length)
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
          placeholder={t('admin.filterEmail')}
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        <Input
          placeholder={t('admin.filterName')}
          value={(table.getColumn('fullName')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('fullName')?.setFilterValue(event.target.value)}
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
                <TableCell colSpan={users.length} className='h-24 text-center'>
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
