export function CodeBlock({ code }: { code: string }) {
  return (
    <pre dir="ltr" className="code-block">
      <code>{code}</code>
    </pre>
  )
}
