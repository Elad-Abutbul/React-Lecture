import { GRAPH_COPY } from '@/constants/graphNavigation'
import type { WorldNode } from '@/types/worldGraph'
import { SceneConsole } from '../world/SceneConsole'
import type { CommandId } from '@/constants/commands'
import { FILES } from '@/content/files'
import { FileDetails } from '../lessons/FileDetails'
import { LEARNING_SCENES } from '@/content/learningScenes'
import { LEARNING_DEMOS } from '../world/WorldLearningScene'
import { CodeBlock } from '../lessons/CodeBlock'
import { LAB_STATIONS } from '@/content/labs'
import { Step01Components } from '../labs/Step01Components'
import { Step02Props } from '../labs/Step02Props'
import { Step03State } from '../labs/Step03State'
import { Step04Effect } from '../labs/Step04Effect'
import { Footer } from '../layout/Footer'
import { LINKS, TOOL_NAMES } from '@/constants/links'
const LAB_DEMOS: Record<string, () => React.ReactNode> = {
  components: Step01Components,
  props: Step02Props,
  state: Step03State,
  effect: Step04Effect,
}
export function GraphContent({ node }: { node: WorldNode }) {
  const Demo =
    node.kind === 'lab'
      ? LAB_DEMOS[node.sourceId!]
      : node.kind === 'lesson'
        ? LEARNING_DEMOS[node.sourceId!]
        : null
  const lesson = LEARNING_SCENES.find(
    (scene) => scene.id === node.sourceId,
  )?.lesson
  const file = FILES.find((file) => file.id === node.sourceId)
  const lab = LAB_STATIONS.find((lab) => lab.id === node.sourceId)
  return (
    <>
      {node.commandIds?.map((id) => (
        <SceneConsole key={id} commandId={id as CommandId} />
      ))}
      {node.helpUrl && (
        <a
          href={node.helpUrl}
          target="_blank"
          rel="noreferrer"
          className="text-react underline"
        >
          {GRAPH_COPY.help}
        </a>
      )}
      {node.id === 'tools' && (
        <div className="flex gap-5">
          <a
            href={LINKS.vscode}
            target="_blank"
            rel="noreferrer"
            className="text-react underline"
          >
            {TOOL_NAMES.vscode}
          </a>
          <a
            href={LINKS.git}
            target="_blank"
            rel="noreferrer"
            className="text-react underline"
          >
            {TOOL_NAMES.git}
          </a>
        </div>
      )}
      {Demo && (
        <div className="graph-demo">
          <Demo />
        </div>
      )}
      {node.kind === 'code' && lesson && <CodeBlock code={lesson.code} />}
      {node.kind === 'file' && file && (
        <FileDetails file={file} headingLevel="h2" />
      )}
      {node.kind === 'lab' && lab && (
        <details className="graph-reference">
          <summary>{GRAPH_COPY.code}</summary>
          <CodeBlock code={lab.code} />
        </details>
      )}
      {node.kind === 'resources' && <Footer />}
      {!!node.commandIds?.length && (
        <p className="graph-external">{GRAPH_COPY.external}</p>
      )}
    </>
  )
}
