import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DotsHorizontalIcon, DownloadIcon, SizeIcon } from '@radix-ui/react-icons'

interface ImageActionsProps {
  shouldMerge?: boolean
  isLink?: boolean
  onView?: () => void
  onDownload?: () => void
  // onCopy?: () => void
  // onCopyLink?: () => void
  // onRemoveImg?: () => void
}

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
}

export const ActionWrapper = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'absolute right-3 top-3 flex flex-row rounded px-0.5 opacity-0 group-hover/node-image:opacity-100',
        'border-[0.5px] bg-[var(--mt-bg-secondary)] [backdrop-filter:saturate(1.8)_blur(20px)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  ))
)

ActionWrapper.displayName = 'ActionWrapper'

export const ActionButton = React.memo(
  React.forwardRef<HTMLButtonElement, ActionButtonProps>(({ icon, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant='ghost'
      className={cn(
        'relative flex h-7 w-7 flex-row rounded-none p-0 text-muted-foreground hover:text-foreground',
        'bg-transparent hover:bg-transparent',
        className
      )}
      {...props}
    >
      {icon}
    </Button>
  ))
)

ActionButton.displayName = 'ActionButton'

type ActionKey = 'onView' | 'onDownload'

const ActionItems: Array<{
  key: ActionKey
  icon: React.ReactNode
  isLink?: boolean
}> = [
  { key: 'onView', icon: <SizeIcon className='size-4' /> },
  { key: 'onDownload', icon: <DownloadIcon className='size-4' /> }
  // { key: 'onCopy', icon: <ClipboardCopyIcon className='size-4' /> },
  // { key: 'onCopyLink', icon: <Link2Icon className='size-4' />, isLink: true },
  // { key: 'onRemoveImg', icon: <TrashIcon className='size-4' /> }
]

export const ImageActions: React.FC<ImageActionsProps> = React.memo(
  ({ shouldMerge = false, isLink = false, ...actions }) => {
    const [isOpen, setIsOpen] = React.useState(false)

    const handleAction = React.useCallback((e: React.MouseEvent, action: (() => void) | undefined) => {
      e.preventDefault()
      e.stopPropagation()
      action?.()
    }, [])

    const filteredActions = React.useMemo(() => ActionItems.filter((item) => isLink || !item.isLink), [isLink])

    return (
      <ActionWrapper className={cn({ 'opacity-100': isOpen })}>
        {shouldMerge ? (
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <ActionButton icon={<DotsHorizontalIcon className='size-4' />} onClick={(e) => e.preventDefault()} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {filteredActions.map(({ key, icon }) => (
                <DropdownMenuItem key={key} onClick={(e) => handleAction(e, actions[key])}>
                  <div className='flex flex-row items-center gap-2'>{icon}</div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          filteredActions.map(({ key, icon }) => (
            <ActionButton key={key} icon={icon} onClick={(e) => handleAction(e, actions[key])} />
          ))
        )}
      </ActionWrapper>
    )
  }
)

ImageActions.displayName = 'ImageActions'
