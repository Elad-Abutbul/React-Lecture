const HIGHLIGHT =
  /(\b(?:return|const|let|function|export|default|import|from|type|className)\b|[{}])/g
export function CodeBlock({ code }: { code: string }) {
  return (
    <pre dir="ltr" className="code-block">
      <code>
        {code.split(HIGHLIGHT).map((token, index) => (
          <span key={index} className={index % 2 ? 'text-violet' : undefined}>
            {token}
          </span>
        ))}
      </code>
    </pre>
  )
}
