import { useState } from 'react'
import { EffectDemo } from '@/components/demos/EffectDemo'
import { Button } from '@/components/ui/button'
import { EFFECT_MODES, EFFECT_UI } from '@/content/lessons'
export function EffectSection() {
  const [mode, setMode] = useState(0)
  return (
    <>
      <EffectDemo />
      <div className="mt-5">
        <p className="text-sm text-muted">{EFFECT_UI.dependencies}</p>
        <div className="my-2 flex flex-wrap gap-2" dir="ltr">
          {EFFECT_MODES.map((item, index) => (
            <Button
              key={item.code}
              size="sm"
              variant={mode === index ? 'secondary' : 'ghost'}
              onClick={() => setMode(index)}
              aria-pressed={mode === index}
            >
              {item.code}
            </Button>
          ))}
        </div>
        <p className="text-sm text-muted">{EFFECT_MODES[mode].description}</p>
      </div>
    </>
  )
}
