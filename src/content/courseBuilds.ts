import sources from './courseSources.json' with { type: 'json' }
const head = (extra: string) =>
  `import { useState } from 'react'\nimport Navbar from './components/Navbar'\nimport { TASK_COPY as C, INITIAL_TASKS } from './constants/tasks'\n${extra}\n`
const header = `const [tab,setTab]=useState<'tasks'|'guide'>('tasks')\n`
const frame = (body: string) =>
  `<div dir="rtl" className="min-h-screen bg-slate-50 p-4 text-slate-950"><div className="mx-auto grid max-w-5xl gap-5"><Navbar tab={tab} onChange={setTab}/>${body}</div></div>`
const apps: Record<string, string> = {
  W00: `import { TASK_COPY as C } from './constants/tasks'\nexport default function App(){return <main dir="rtl"><h1>{C.brand}</h1><p>{C.description}</p></main>}`,
  W01: `import {useState} from 'react'\nimport Navbar from './components/Navbar'\nexport default function App(){${header}return ${frame('')}}`,
  W02: `import {useState} from 'react'\nimport Navbar from './components/Navbar'\nimport Hero from './components/Hero'\nexport default function App(){${header}return ${frame('<Hero/>')}}`,
  W03: `import {INITIAL_TASKS} from './constants/tasks'\nexport default function App(){return <pre dir="ltr">{JSON.stringify(INITIAL_TASKS,null,2)}</pre>}`,
  W04: `import TaskItem from './components/TaskItem'\nimport {INITIAL_TASKS} from './constants/tasks'\nexport default function App(){return <ul dir="rtl"><TaskItem task={INITIAL_TASKS[0]} onToggle={()=>{}} onDelete={()=>{}} onEdit={()=>{}}/></ul>}`,
  W05: `import TaskList from './components/TaskList'\nimport {INITIAL_TASKS} from './constants/tasks'\nexport default function App(){return <TaskList tasks={INITIAL_TASKS} onToggle={()=>{}} onDelete={()=>{}} onEdit={()=>{}}/>}`,
}
const commonImports = `import TaskList from './components/TaskList'\nimport AddTaskForm from './components/AddTaskForm'\nimport type {Task,TaskCategory,TaskFilter} from './types/task'`
const actions = `function addTask(title:string,category:TaskCategory){setTasks(previous=>[{id:crypto.randomUUID(),title,category,completed:false},...previous])}\nfunction toggleTask(id:string){setTasks(previous=>previous.map(task=>task.id===id?{...task,completed:!task.completed}:task))}\nfunction deleteTask(id:string){setTasks(previous=>previous.filter(task=>task.id!==id))}\nfunction editTask(id:string,title:string){setTasks(previous=>previous.map(task=>task.id===id?{...task,title}:task))}`
for (const id of ['W06', 'W07', 'W08']) {
  const full = id === 'W08',
    edits = id !== 'W06'
  const imports =
    commonImports.replace(',TaskFilter', '') +
    (full
      ? `\nimport Stats from './components/Stats'\nimport FilterTabs from './components/FilterTabs'\nimport type {TaskFilter} from './types/task'`
      : '')
  const state =
    `const [tasks,setTasks]=useState<Task[]>(INITIAL_TASKS)\n` +
    (full
      ? `const [query,setQuery]=useState(''),[filter,setFilter]=useState<TaskFilter>('all')\nconst completed=tasks.filter(task=>task.completed).length\nconst visible=tasks.filter(task=>task.title.toLowerCase().includes(query.toLowerCase())&&(filter==='all'||(filter==='completed'?task.completed:!task.completed)))\n`
      : '')
  const handlers = edits
    ? actions
    : actions.slice(0, actions.indexOf('function toggleTask'))
  const content =
    `<h1>{C.heading}</h1>` +
    (full
      ? `<Stats total={tasks.length} completed={completed}/><input aria-label={C.search} value={query} onChange={e=>setQuery(e.target.value)}/><FilterTabs value={filter} onChange={setFilter}/>`
      : '') +
    `<AddTaskForm onAdd={addTask}/><TaskList tasks={${full ? 'visible' : 'tasks'}} onToggle={${edits ? 'toggleTask' : '()=>{}'}} onDelete={${edits ? 'deleteTask' : '()=>{}'}} onEdit={${edits ? 'editTask' : '()=>{}'}}/>`
  apps[id] =
    head(imports) +
    `export default function App(){${header}${state}${handlers}\nreturn ${frame(content)}}`
}
apps.W09 = sources['src/App.tsx']
apps.W10 = sources['src/App.tsx']
function dependencies(app: string) {
  const all: Record<string, string> = { ...sources, 'src/App.tsx': app },
    result: Record<string, string> = {}
  function include(path: string) {
    if (result[path]) return
    const code = all[path]
    if (code === undefined) throw Error('Missing student source ' + path)
    result[path] = code
    for (const match of code.matchAll(/from ['"]([.][^'"]+)['"]/g)) {
      const parts = path.split('/')
      parts.pop()
      for (const p of match[1].split('/')) {
        if (p === '..') parts.pop()
        else if (p !== '.') parts.push(p)
      }
      const base = parts.join('/'),
        file = Object.keys(all).find(
          (name) => name === base + '.ts' || name === base + '.tsx',
        )
      if (file) include(file)
    }
  }
  include('src/App.tsx')
  return result
}
export const COURSE_BUILDS = Object.fromEntries(
  Object.entries(apps).map(([id, app]) => [id, dependencies(app)]),
)
