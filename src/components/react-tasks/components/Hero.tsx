import { TASK_COPY as C } from '../constants/tasks'
export default function Hero() {
  return (
    <section className="py-3">
      <h2 className="text-2xl font-bold text-slate-950">{C.heading}</h2>
      <p className="mt-2 text-slate-600">{C.description}</p>
    </section>
  )
}
