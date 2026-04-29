import { useNavigate } from 'react-router-dom'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import { useAvatarStore } from '../../features/avatar/avatar-store'
import type { ModelType } from '@cloth-ai/contracts'

const OPTIONS: Array<{
  id: ModelType
  title: string
  desc: string
  badge: string
  gradient: string
}> = [
  {
    id: 'tall',
    title: 'Высокий',
    desc: 'Рост 185 • стройное телосложение',
    badge: 'Tall',
    gradient: 'from-violet-500/25 via-fuchsia-500/10 to-transparent',
  },
  {
    id: 'mid',
    title: 'Средний',
    desc: 'Рост 165 • среднее телосложение',
    badge: 'Mid',
    gradient: 'from-sky-500/25 via-cyan-500/10 to-transparent',
  },
  {
    id: 'curvy',
    title: 'Плотный',
    desc: 'Рост 175 • плотное телосложение',
    badge: 'Curvy',
    gradient: 'from-amber-500/25 via-orange-500/10 to-transparent',
  },
]

export function OnboardingAvatarPage() {
  const navigate = useNavigate()
  const setModelType = useAvatarStore((s) => s.setModelType)
  const current = useAvatarStore((s) => s.modelType)

  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden p-5">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/15 via-transparent to-transparent" />
        <div className="relative">
          <div className="text-xs font-medium text-neutral-300">
            Шаг 1 из 1
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Выбери типаж
          </h1>
          <p className="mt-2 text-sm text-neutral-300">
            Один раз — и вся одежда в каталоге будет показана на выбранной модели.
            Ты не загружаешь селфи.
          </p>
        </div>
      </Card>

      <div className="space-y-3">
        {OPTIONS.map((o) => {
          const isSelected = current === o.id
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setModelType(o.id)
              }}
              className="block w-full text-left"
            >
              <Card
                className={[
                  'relative overflow-hidden p-4 transition',
                  isSelected ? 'ring-2 ring-violet-400' : 'hover:ring-white/20',
                ].join(' ')}
              >
                <div
                  className={[
                    'pointer-events-none absolute inset-0 bg-gradient-to-br',
                    o.gradient,
                  ].join(' ')}
                />

                <div className="relative flex items-center gap-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-neutral-950 ring-1 ring-white/10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
                    <div className="absolute bottom-2 left-2 right-2 h-1.5 rounded-full bg-white/10" />
                    <div className="absolute bottom-4 left-4 right-4 h-12 rounded-2xl bg-white/5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-semibold">
                        {o.title}
                      </div>
                      <span className="rounded-full bg-neutral-950 px-2 py-0.5 text-[11px] text-neutral-300 ring-1 ring-white/10">
                        {o.badge}
                      </span>
                      {isSelected && (
                        <span className="rounded-full bg-violet-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                          Выбрано
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-neutral-300">{o.desc}</div>
                  </div>

                  <div className="shrink-0">
                    <div
                      className={[
                        'h-5 w-5 rounded-full ring-2 transition',
                        isSelected
                          ? 'bg-violet-500 ring-violet-300'
                          : 'bg-transparent ring-white/20',
                      ].join(' ')}
                    />
                  </div>
                </div>
              </Card>
            </button>
          )
        })}
      </div>

      <div className="pt-1">
        <Button
          className="w-full"
          disabled={!current}
          onClick={() => {
            if (!current) return
            navigate('/')
          }}
        >
          Продолжить
        </Button>
        <div className="mt-2 text-center text-xs text-neutral-400">
          Можно поменять типаж позже.
        </div>
      </div>
    </div>
  )
}

