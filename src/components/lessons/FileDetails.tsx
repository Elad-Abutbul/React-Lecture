import { FILES } from '@/content/files'
import { CodeBlock } from './CodeBlock'
export function FileDetails({ file }: { file: (typeof FILES)[number] }) {
  return (
    <div>
      <p dir="ltr" className="mb-4 font-mono text-sm text-react">
        {file.path}
      </p>
      <h3 className="text-2xl font-semibold">{file.role}</h3>
      <p className="my-5 text-muted">{file.relation}</p>
      <CodeBlock code={file.code} />
    </div>
  )
}
