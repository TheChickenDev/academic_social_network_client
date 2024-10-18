import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import React from 'react'

function EditorCodeBlockSelectLanguage({
  defaultLanguage,
  updateAttributes,
  extension
}: {
  defaultLanguage: string
  updateAttributes: (attrs: { language: string }) => void
  extension: { options: { lowlight: { listLanguages: () => string[] } } }
}) {
  return (
    <Select onValueChange={(value) => updateAttributes({ language: value })} defaultValue={defaultLanguage}>
      <SelectTrigger>
        <SelectValue placeholder='Auto' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Language</SelectLabel>
          <SelectItem value='null'>Auto</SelectItem>
          {extension.options.lowlight.listLanguages().map((lang: string, index: number) => (
            <SelectItem key={index} value={lang}>
              {lang}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default React.memo(EditorCodeBlockSelectLanguage)
