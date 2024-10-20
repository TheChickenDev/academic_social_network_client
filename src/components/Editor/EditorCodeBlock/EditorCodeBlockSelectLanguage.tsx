import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import programmingLanguages from '@/constants/editor'
import React from 'react'

function EditorCodeBlockSelectLanguage({
  defaultLanguage,
  updateAttributes
}: {
  defaultLanguage: string
  updateAttributes: (attrs: { language: string }) => void
}) {
  return (
    <Select onValueChange={(value) => updateAttributes({ language: value })}>
      <SelectTrigger className='editor-code-block-select-language'>
        <SelectValue placeholder={defaultLanguage || 'Auto'} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Language</SelectLabel>
          <SelectItem value='null'>Auto</SelectItem>
          {programmingLanguages.map((lang: string, index: number) => (
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
