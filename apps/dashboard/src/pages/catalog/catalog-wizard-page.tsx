import { useEffect, useMemo, useRef, useState } from 'react'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import { LuCheck, LuCloudUpload, LuImagePlus, LuSparkles } from 'react-icons/lu'
import {
  createCatalogItemDraft,
  getCatalogRow,
  setCatalogStatus,
  triggerAiGeneration,
  updateCatalogRow,
  uploadCatalogPhoto,
} from '../../shared/api/api-client'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCatalogRowQuery } from '../../shared/api/queries'

type Step = 1 | 2 | 3
type Category = 'tops' | 'bottoms' | 'dresses'

function StepPill({
  step,
  current,
  label,
}: {
  step: Step
  current: Step
  label: string
}) {
  const isDone = step < current
  const isActive = step === current
  return (
    <div
      className={[
        'flex items-center gap-2 rounded-full px-3 py-2 text-xs ring-1',
        isActive
          ? 'bg-violet-500/20 text-neutral-50 ring-violet-400/40'
          : isDone
            ? 'bg-neutral-950/60 text-neutral-200 ring-white/10'
            : 'bg-neutral-950/30 text-neutral-400 ring-white/10',
      ].join(' ')}
    >
      <span
        className={[
          'grid h-5 w-5 place-items-center rounded-full text-[11px] font-semibold ring-1',
          isDone
            ? 'bg-violet-500 text-white ring-violet-300'
            : isActive
              ? 'bg-neutral-950 text-neutral-50 ring-white/15'
              : 'bg-neutral-950 text-neutral-500 ring-white/10',
        ].join(' ')}
      >
        {isDone ? <LuCheck className="h-3.5 w-3.5" /> : step}
      </span>
      {label}
    </div>
  )
}

const FALLBACK = {
  original:
    'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=60',
  tall: 'https://images.unsplash.com/photo-1520975732137-0462f16d0d86?auto=format&fit=crop&w=900&q=60',
  mid: 'https://images.unsplash.com/photo-1520975693413-35e3c3c94762?auto=format&fit=crop&w=900&q=60',
  curvy:
    'https://images.unsplash.com/photo-1520975687797-1b3f2a444ef1?auto=format&fit=crop&w=900&q=60',
}

export function CatalogWizardPage() {
  const navigate = useNavigate()
  const { itemId } = useParams()
  const isEdit = !!itemId
  const [workingId, setWorkingId] = useState<string | null>(itemId ?? null)
  const rowId = itemId ?? workingId ?? ''
  const rowQuery = useCatalogRowQuery(rowId, { pollWhileGenerating: true })
  const fileRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<Step>(1)
  const [title, setTitle] = useState('')
  const [priceTjs, setPriceTjs] = useState<number>(199)
  const [category, setCategory] = useState<Category>('tops')
  const [isGenerating, setIsGenerating] = useState(false)

  const canContinue1 = title.trim().length > 2 && priceTjs > 0

  const tiles = useMemo(() => {
    const row = rowQuery.data
    if (!row) {
      return {
        original: FALLBACK.original,
        tall: FALLBACK.tall,
        mid: FALLBACK.mid,
        curvy: FALLBACK.curvy,
      }
    }
    const orig = row.sourceImageUrl || row.coverUrl || FALLBACK.original
    const mi = row.modelImages || {}
    return {
      original: orig,
      tall: mi.tall || FALLBACK.tall,
      mid: mi.mid || FALLBACK.mid,
      curvy: mi.curvy || FALLBACK.curvy,
    }
  }, [rowQuery.data])

  useEffect(() => {
    if (!isEdit) return
    if (!rowQuery.data) return
    setWorkingId(rowQuery.data.id)
    setTitle(rowQuery.data.title)
    setPriceTjs(rowQuery.data.priceTjs)
    setCategory(rowQuery.data.category as Category)
  }, [isEdit, rowQuery.data])

  return (
    <div className="space-y-4">
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (!file) return
          try {
            let id = workingId
            if (!id) {
              const res = await createCatalogItemDraft()
              id = res.id
              setWorkingId(id)
            }
            await uploadCatalogPhoto(id, file)
            await rowQuery.refetch()
          } catch (err) {
            alert(err instanceof Error ? err.message : 'Ошибка загрузки')
          }
        }}
      />

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {isEdit ? 'Редактировать товар' : 'Добавить товар'}
          </h1>
          <p className="mt-1 text-sm text-neutral-300">
            Мастер: фото → генерация (OpenAI) → публикация.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StepPill step={1} current={step} label="Данные" />
          <StepPill step={2} current={step} label="Генерация" />
          <StepPill step={3} current={step} label="Публикация" />
        </div>
      </header>

      {isEdit && rowQuery.isLoading && (
        <Card className="p-4 text-sm text-neutral-200">Загружаем товар…</Card>
      )}
      {isEdit && rowQuery.isError && (
        <Card className="p-4">
          <div className="text-sm font-medium">Товар не найден</div>
          <div className="mt-3">
            <Link to="/catalog">
              <Button variant="secondary">В каталог</Button>
            </Link>
          </div>
        </Card>
      )}

      {step === 1 && (
        <Card className="p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="text-sm font-medium">Фото</div>
              <div className="rounded-2xl bg-neutral-950/60 p-4 ring-1 ring-white/10">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-500/15 ring-1 ring-violet-400/30">
                    <LuImagePlus className="h-5 w-5 text-violet-200" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">Загрузить фото</div>
                    <div className="mt-0.5 text-xs text-neutral-300">
                      JPG / PNG / WebP → S3, затем генерация на шаге 2.
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="secondary" type="button" onClick={() => fileRef.current?.click()}>
                    <LuCloudUpload className="mr-2 h-4 w-4" />
                    Выбрать файл
                  </Button>
                </div>
                {rowQuery.data?.coverUrl && (
                  <div className="mt-3 overflow-hidden rounded-xl ring-1 ring-white/10">
                    <img
                      src={rowQuery.data.coverUrl}
                      alt="Превью"
                      className="max-h-48 w-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium">Данные</div>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <label className="text-xs text-neutral-300">Название</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-xl bg-neutral-950 px-3 py-2 text-sm ring-1 ring-white/10"
                    placeholder="Платье синее"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <label className="text-xs text-neutral-300">Цена (TJS)</label>
                    <input
                      type="number"
                      value={priceTjs}
                      onChange={(e) => setPriceTjs(Number(e.target.value))}
                      className="rounded-xl bg-neutral-950 px-3 py-2 text-sm ring-1 ring-white/10"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs text-neutral-300">Категория</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="rounded-xl bg-neutral-950 px-3 py-2 text-sm ring-1 ring-white/10"
                    >
                      <option value="tops">Топ</option>
                      <option value="bottoms">Низ</option>
                      <option value="dresses">Платья</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button disabled={!canContinue1} onClick={() => setStep(2)}>
                  Дальше
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">Генерация типажей</div>
              <div className="mt-1 text-xs text-neutral-300">
                GPT-4o-mini + DALL·E 3 (три полноформатных кадра). Занимает 1–3 минуты.
              </div>
            </div>
            <Button
              disabled={isGenerating}
              onClick={async () => {
                setIsGenerating(true)
                let id = workingId
                try {
                  if (!id) {
                    const res = await createCatalogItemDraft()
                    id = res.id
                    setWorkingId(id)
                  }
                  await updateCatalogRow({
                    id,
                    title: title.trim(),
                    priceTjs,
                    category,
                  })
                  await triggerAiGeneration(id)
                  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
                  let row = await getCatalogRow(id)
                  for (let i = 0; i < 120; i++) {
                    if (row.status !== 'generating') break
                    await sleep(2000)
                    row = await getCatalogRow(id)
                  }
                  if (row.generationError) {
                    alert(row.generationError)
                    setIsGenerating(false)
                    return
                  }
                  if (row.status !== 'generated') {
                    alert(`Генерация не завершена (статус: ${row.status})`)
                    setIsGenerating(false)
                    return
                  }
                  await rowQuery.refetch()
                  setStep(3)
                } catch (err) {
                  alert(err instanceof Error ? err.message : 'Ошибка генерации')
                } finally {
                  setIsGenerating(false)
                }
              }}
            >
              <LuSparkles className="mr-2 h-4 w-4" />
              {isGenerating ? 'Генерируем…' : 'Запустить'}
            </Button>
          </div>

          {rowQuery.data?.generationError && (
            <div className="mt-3 rounded-xl bg-red-950/40 p-3 text-xs text-red-200 ring-1 ring-red-500/30">
              {rowQuery.data.generationError}
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3">
            {(['original', 'tall', 'mid', 'curvy'] as const).map((k) => (
              <div
                key={k}
                className={[
                  'aspect-[3/4] w-full overflow-hidden rounded-2xl ring-1 ring-white/10',
                  isGenerating || rowQuery.data?.status === 'generating'
                    ? 'animate-pulse bg-neutral-900'
                    : 'bg-neutral-950/60',
                ].join(' ')}
              >
                {!isGenerating && rowQuery.data?.status !== 'generating' && (
                  <img src={tiles[k]} alt={k} className="h-full w-full object-cover" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="secondary" onClick={() => setStep(1)} disabled={isGenerating}>
              Назад
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={isGenerating || rowQuery.data?.status !== 'generated'}
            >
              К публикации
            </Button>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">Проверка и публикация</div>
              <div className="mt-1 text-xs text-neutral-300">
                Продавец видит оригинал + 3 типажа. Потом публикует.
              </div>
            </div>
            <Button
              onClick={async () => {
                if (!workingId) return
                await setCatalogStatus({ id: workingId, status: 'published' })
                navigate('/catalog')
              }}
              disabled={!workingId}
            >
              Опубликовать
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {(
              [
                ['Оригинал', tiles.original],
                ['Высокий', tiles.tall],
                ['Средний', tiles.mid],
                ['Плотный', tiles.curvy],
              ] as const
            ).map(([label, url]) => (
              <div key={label} className="overflow-hidden rounded-2xl ring-1 ring-white/10">
                <div className="aspect-[3/4] w-full bg-neutral-950">
                  <img src={url} alt={label} className="h-full w-full object-cover" />
                </div>
                <div className="p-2 text-xs text-neutral-300">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setTitle('')
                setPriceTjs(199)
                setCategory('tops')
                setWorkingId(null)
                setStep(1)
              }}
            >
              Добавить ещё
            </Button>
            <Button variant="ghost" onClick={() => setStep(2)}>
              Перегенерировать
            </Button>
          </div>

          <div className="mt-3 text-xs text-neutral-400">
            {workingId ? `ID: ${workingId}` : 'ID появится после создания'} • {title || '—'} • {priceTjs}{' '}
            TJS • {category}
          </div>
        </Card>
      )}
    </div>
  )
}
