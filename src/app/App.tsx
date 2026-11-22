import { APP_CONTENT } from '@/content/app'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export default function App() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <Card>
        <CardContent>
          <Badge>{APP_CONTENT.stack}</Badge>
          <h1 className="my-6 text-4xl text-react">{APP_CONTENT.title}</h1>
          <p>{APP_CONTENT.description}</p>
        </CardContent>
      </Card>
    </main>
  )
}
