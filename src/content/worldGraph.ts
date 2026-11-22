import { HANDS_ON_GRAPH } from './handsOnGraph'
import { JOURNEY_NODES } from './journey'
import { LEARNING_SCENES } from './learningScenes'
import { FILES } from './files'
import { LAB_STATIONS } from './labs'
import { QUIZ_QUESTIONS } from './quiz'
import { TROUBLESHOOTING } from './troubleshooting'
import {
  GRAPH_NAV,
  GRAPH_COPY,
  INSTALL_POSITIONS,
  COMMAND_OUTCOMES,
} from '@/constants/graphNavigation'
import type { WorldNode, WorldEdge } from '@/types/worldGraph'
const nodes: WorldNode[] = []
const position = (x: number, y: number) => ({
  x: GRAPH_NAV.origin.x + x,
  y: GRAPH_NAV.origin.y + y,
})
const edge = (
  id: string,
  target: string,
  label: string,
  direction: WorldEdge['direction'] = 'forward',
): WorldEdge => ({ id, target, label, direction })
for (const original of JOURNEY_NODES.filter(
  (node) => INSTALL_POSITIONS[node.id],
)) {
  const p = INSTALL_POSITIONS[original.id]
  const source =
    original.id === 'create'
      ? {
          ...original,
          choices: [
            {
              id: 'done',
              label: GRAPH_COPY.installation,
              nextNodeId: 'create-result',
            },
          ],
        }
      : original
  const choices = source.choices
  const question = choices.length > 1
  const current: WorldNode = {
    id: source.id,
    title: source.title,
    description:
      source.id === 'verify'
        ? 'מריצים node -v ו־npm -v ומשווים לדרישות Vite. איזה פלט קיבלת?'
        : source.id === 'browser'
          ? 'פותחים את כתובת Local המדויקת שהטרמינל הציג. מה מופיע בדפדפן?'
          : source.description,
    kind: question ? 'decision' : 'installation',
    sourceId: source.id,
    position: position(p.x, p.y),
    commandIds: source.commandId
      ? [source.commandId]
      : source.checkpoint
        ? [...source.checkpoint.commandIds]
        : [],
    helpUrl: source.helpUrl,
    edges: choices.map((choice) =>
      edge(
        choice.id,
        choice.nextNodeId,
        choice.label,
        !question
          ? 'forward'
          : ['yes', 'existing', 'mac', 'done'].includes(choice.id)
            ? 'right'
            : 'left',
      ),
    ),
  }
  // A failed command owns its troubleshooting branch; its return rejoins that exact command.
  for (const failed of current.edges.filter((e) => e.id === 'error')) {
    const tips = TROUBLESHOOTING[source.id === 'verify' ? 'node' : 'browser']
    failed.target = `${source.id}-help-0`
    failed.label = 'פלט שגיאה'
    tips.forEach((tip, index) =>
      nodes.push({
        id: `${source.id}-help-${index}`,
        title: tip.title,
        description: tip.body,
        kind: 'installation',
        position: position(p.x - 1000 - index * 350, p.y + 750 + index * 650),
        edges: [
          edge(
            'return',
            index === tips.length - 1
              ? source.id
              : `${source.id}-help-${index + 1}`,
            GRAPH_COPY.read,
          ),
        ],
      }),
    )
  }
  if (current.id === 'node')
    current.edges = [
      edge('yes', 'verify', 'כן · בדיקת גרסאות', 'right'),
      edge('no', 'os', 'לא · התקנת Node.js', 'left'),
    ]
  if (current.id === 'verify')
    current.edges.find((e) => e.id === 'done')!.label = 'מספרי גרסאות תקינים'
  if (current.id === 'browser')
    current.edges.find((e) => e.id === 'done')!.label = 'האתר מופיע בדפדפן'
  if (current.id === 'scripts')
    current.edges.find((e) => e.id === 'done')!.label = 'מצאתי את סקריפט הפיתוח'
  if (current.id === 'success')
    current.edges = [edge('learn', 'declarative', GRAPH_COPY.read)]
  const outcome = COMMAND_OUTCOMES[current.id]
  if (outcome) {
    const resultId = `${current.id}-result`
    const outcomes = current.edges.map((e) => ({
      ...e,
      label: e.id === 'done' ? outcome.label : e.label,
    }))
    nodes.push({
      id: resultId,
      title: outcome.question,
      description: 'משווים את הפלט במחשב שלך ובוחרים את הנתיב שמתאר אותו.',
      kind: 'decision',
      position: position(p.x, p.y + 450),
      edges: outcomes,
    })
    current.kind = 'installation'
    current.edges = [edge('path', resultId, GRAPH_COPY.read)]
  }
  if (current.edges.length === 1) current.edges[0].label = GRAPH_COPY.read
  nodes.push(current)
}
nodes.push({
  id: 'create-result',
  title: 'מה קרה ביצירת הפרויקט?',
  description:
    'בדקו שבמחשב שלכם נוצרו package.json ותיקיית src. אין לאתר גישה לקבצים שלכם.',
  kind: 'decision',
  position: position(850, 5400),
  edges: [
    edge('done', 'enter', 'התיקייה נוצרה', 'right'),
    edge('error', 'create-help-0', 'פלט שגיאה', 'left'),
  ],
})
TROUBLESHOOTING.browser.forEach((tip, index) =>
  nodes.push({
    id: `create-help-${index}`,
    title: tip.title,
    description: tip.body,
    kind: 'installation',
    position: position(-400 - index * 350, 6000 + index * 650),
    edges: [
      edge(
        'return',
        index === TROUBLESHOOTING.browser.length - 1
          ? 'create'
          : `create-help-${index + 1}`,
        GRAPH_COPY.read,
      ),
    ],
  }),
)
// Installation content is followed by every presentation step in the same graph.
const learning: WorldNode[] = []
function add(
  node: Omit<WorldNode, 'position' | 'edges'>,
  edges: WorldEdge[] = [],
) {
  const index = learning.length
  learning.push({
    ...node,
    position: position(
      3000 + ((index % 3) - 1) * 280,
      13000 + index * GRAPH_NAV.stride,
    ),
    edges,
  })
}
for (const scene of LEARNING_SCENES) {
  if (scene.id === 'files') {
    FILES.forEach((file, index) =>
      add({
        id: index === 0 ? 'files' : `file-${file.id}`,
        title: file.path,
        description: file.relation,
        kind: 'file',
        sourceId: file.id,
      }),
    )
  } else if (scene.id === 'labs') {
    LAB_STATIONS.forEach((lab, index) =>
      add({
        id: index === 0 ? 'labs' : `lab-${lab.id}`,
        title: `מעבדה · ${lab.title}`,
        description:
          'משנים את ההדגמה החיה וקוראים את הקוד. הניסוי אינו מפעיל קוד שהקלדתם.',
        kind: 'lab',
        sourceId: lab.id,
      }),
    )
  } else if (scene.id === 'quiz') {
    QUIZ_QUESTIONS.forEach((question, index) => {
      const id = index === 0 ? 'quiz' : `quiz-${question.id}`
      add({
        id,
        title: question.prompt,
        description: GRAPH_COPY.question,
        kind: 'decision',
        sourceId: question.id,
      })
      const quiz = learning.at(-1)!
      quiz.edges = question.options.map((option, i) =>
        edge(
          `answer-${i}`,
          `${id}-answer-${i}`,
          option,
          i < question.options.length / 2 ? 'left' : 'right',
        ),
      )
      question.options.forEach((_, i) =>
        add(
          {
            id: `${id}-answer-${i}`,
            title:
              i === question.answer ? GRAPH_COPY.correct : GRAPH_COPY.feedback,
            description: question.explanation,
            kind: 'feedback',
          },
          [edge('merge', `@after-${id}`, GRAPH_COPY.read)],
        ),
      )
    })
  } else if (scene.lesson) {
    const lesson = scene.lesson
    add({
      id: scene.id,
      title: lesson.title,
      description: lesson.body,
      kind: 'lesson',
      sourceId: scene.id,
      part: 'demo',
    })
    add({
      id: `${scene.id}-code`,
      title: `${GRAPH_COPY.code} · ${scene.title}`,
      description: '',
      kind: 'code',
      sourceId: scene.id,
      part: 'code',
    })
    const id = `${scene.id}-check`
    add({
      id,
      title: lesson.check.prompt,
      description: GRAPH_COPY.question,
      kind: 'decision',
      sourceId: scene.id,
    })
    learning.at(-1)!.edges = lesson.check.options.map((option, i) =>
      edge(
        `answer-${i}`,
        `${id}-answer-${i}`,
        option,
        i === 0 ? 'left' : 'right',
      ),
    )
    lesson.check.options.forEach((_, i) =>
      add(
        {
          id: `${id}-answer-${i}`,
          title:
            i === lesson.check.answer
              ? GRAPH_COPY.correct
              : GRAPH_COPY.feedback,
          description: lesson.check.explanation,
          kind: 'feedback',
        },
        [edge('merge', `@after-${id}`, GRAPH_COPY.read)],
      ),
    )
  } else if (scene.id === 'resources')
    add({
      id: scene.id,
      title: scene.title,
      description: GRAPH_COPY.end,
      kind: 'resources',
    })
}
// Feedback siblings merge at the next instructional node, rather than becoming a linear list.
for (let i = 0; i < learning.length; i++) {
  const node = learning[i]
  if (node.edges[0]?.target.startsWith('@after-')) {
    const group = node.edges[0].target.slice(7)
    const next = learning
      .slice(i + 1)
      .find((n) => !n.id.startsWith(`${group}-answer-`))
    node.edges[0].target = next?.id ?? 'resources'
  } else if (!node.edges.length && node.id !== 'resources')
    node.edges = [edge('path', learning[i + 1].id, GRAPH_COPY.read)]
  if (node.kind === 'decision')
    node.edges.forEach((e, index) => {
      const child = learning.find((n) => n.id === e.target)!
      child.position = {
        x:
          node.position.x +
          (index - (node.edges.length - 1) / 2) * GRAPH_NAV.branchX * 1.5,
        y: node.position.y + GRAPH_NAV.stride,
      }
    })
}
let row = 0,
  previousFeedback = false
for (const node of learning) {
  if (!(node.kind === 'feedback' && previousFeedback)) row++
  node.position = position(
    3000 + ((row % 3) - 1) * 280,
    12500 + row * GRAPH_NAV.stride,
  )
  previousFeedback = node.kind === 'feedback'
}
for (const node of learning.filter((n) => n.kind === 'decision'))
  node.edges.forEach((edge, index) => {
    const child = learning.find((n) => n.id === edge.target)!
    child.position = {
      x:
        node.position.x +
        (index - (node.edges.length - 1) / 2) * GRAPH_NAV.branchX * 1.5,
      y: node.position.y + GRAPH_NAV.stride,
    }
  })
const createNode = nodes.find((node) => node.id === 'create')!
createNode.kind = 'decision'
createNode.edges = [
  edge('workshop', 'workshop-plan', GRAPH_COPY.workshop, 'left'),
  edge('installation', 'create-result', GRAPH_COPY.installation, 'right'),
]
nodes.push(...HANDS_ON_GRAPH)
nodes.push(...learning)
export const WORLD_GRAPH: readonly WorldNode[] = nodes
export const GRAPH_BY_ID = Object.fromEntries(
  WORLD_GRAPH.map((node) => [node.id, node]),
)
