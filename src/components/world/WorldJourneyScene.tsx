import { useState } from 'react'
import type { JourneyNode } from '@/types/journey'
import { Button } from '@/components/ui/button'
import { JOURNEY_COPY } from '@/content/journey'
import { TROUBLESHOOTING } from '@/content/troubleshooting'
import { LINKS, TOOL_NAMES } from '@/constants/links'
import { SceneConsole } from './SceneConsole'
export function WorldJourneyScene({
  node,
  onChoose,
}: {
  node: JourneyNode
  onChoose: (id: string) => void
}) {
  const [tip, setTip] = useState(0)
  const tips = node.helpKey ? TROUBLESHOOTING[node.helpKey] : []
  const Heading = node.kind === 'question' ? 'h1' : 'h2'
  return (
    <article
      className={`focus-content ${node.kind === 'question' ? 'decision-content' : ''}`}
      aria-labelledby={`scene-title-${node.id}`}
    >
      <Heading id={`scene-title-${node.id}`} className="focus-title">
        {node.title}
      </Heading>
      <p className="focus-description">{node.description}</p>
      {node.kind !== 'question' && (
        <>
          <div className="scene-workspace">
            {node.commandId && <SceneConsole commandId={node.commandId} />}
            <div className="checkpoint-consoles">
              {node.checkpoint?.commandIds.map((commandId) => (
                <SceneConsole key={commandId} commandId={commandId} />
              ))}
            </div>
            {!!tips.length && (
              <div data-gesture-ignore>
                <div className="mb-3 flex flex-wrap gap-2">
                  {tips.map((item, index) => (
                    <Button
                      key={item.title}
                      size="sm"
                      variant={tip === index ? 'secondary' : 'ghost'}
                      onClick={() => setTip(index)}
                    >
                      {item.title}
                    </Button>
                  ))}
                </div>
                <p className="text-muted">{tips[tip].body}</p>
              </div>
            )}
            {node.helpUrl && (
              <a
                href={node.helpUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm text-react underline"
              >
                {JOURNEY_COPY.help}
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
          </div>
          <div className="scene-actions">
            {node.choices.map((choice) => (
              <Button
                key={choice.id}
                variant={choice.complete === false ? 'outline' : 'default'}
                className="h-auto min-h-11 whitespace-normal rounded-full px-6"
                onClick={() => onChoose(choice.id)}
              >
                {choice.label}
              </Button>
            ))}
          </div>
          {(node.kind === 'command' || node.kind === 'checkpoint') && (
            <p className="mt-3 text-xs text-muted">{JOURNEY_COPY.manual}</p>
          )}
        </>
      )}
    </article>
  )
}
