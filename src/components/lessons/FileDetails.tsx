import { FILES } from '@/content/files'
import { CodeBlock } from './CodeBlock'
export function FileDetails({
  file,
  headingLevel: Heading = 'h3',
}: {
  file: (typeof FILES)[number]
  headingLevel?: 'h2' | 'h3'
}) {
  return (
    <div>
      <p dir="ltr" className="mb-4 font-mono text-sm text-react">
        {file.path}
      </p>
      <Heading className="text-2xl font-semibold">{file.role}</Heading>
      <p className="my-5 text-muted">{file.relation}</p>
      <CodeBlock code={file.code} />
    </div>
  )
}
