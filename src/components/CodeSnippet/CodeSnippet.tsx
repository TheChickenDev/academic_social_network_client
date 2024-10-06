import { Highlight, themes } from 'prism-react-renderer'

export default function CodeSnippet({ codeBlock, language }: { codeBlock: string; language: string }) {
  return (
    <Highlight theme={themes.nightOwl} code={codeBlock} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span className='select-none'>{i + 1}&nbsp;</span>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}
