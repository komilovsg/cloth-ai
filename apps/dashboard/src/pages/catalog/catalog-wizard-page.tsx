import { useEffect, useMemo, useRef, useState } from 'react'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import { LuCheck, LuCircleAlert, LuCloudUpload, LuImagePlus, LuSparkles } from 'react-icons/lu'
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
import { useToastStore } from '../../shared/toast-store'

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
  const outer = isActive
    ? 'bg-violet-600 text-white shadow-sm ring-violet-500 dark:bg-violet-500/20 dark:text-neutral-50 dark:shadow-none dark:ring-violet-400/40'
    : isDone
      ? 'bg-violet-50 text-violet-950 ring-violet-300 dark:bg-neutral-950/60 dark:text-neutral-200 dark:ring-white/10'
      : 'bg-neutral-100 text-neutral-900 ring-neutral-300 dark:bg-neutral-950/30 dark:text-neutral-400 dark:ring-white/10'

  const inner = isDone
    ? 'bg-violet-600 text-white ring-violet-400 dark:bg-violet-500 dark:text-white dark:ring-violet-300'
    : isActive
      ? 'bg-white text-violet-700 ring-violet-300 dark:bg-neutral-950 dark:text-neutral-50 dark:ring-white/15'
      : 'bg-neutral-200 text-neutral-900 ring-neutral-300 dark:bg-neutral-950 dark:text-neutral-500 dark:ring-white/10'

  return (
    <div className={['flex items-center gap-2 rounded-full px-3 py-2 text-xs ring-1', outer].join(' ')}>
      <span
        className={[
          'grid h-5 w-5 place-items-center rounded-full text-[11px] font-semibold ring-1',
          inner,
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
  const showToast = useToastStore((s) => s.show)
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
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [uploadBanner, setUploadBanner] = useState<
    null | { kind: 'success' | 'error'; message: string }
  >(null)

  const canContinue1 = title.trim().length > 2 && priceTjs > 0

  const photoPreviewUrl = rowQuery.data?.coverUrl || rowQuery.data?.sourceImageUrl

  useEffect(() => {
    if (uploadBanner?.kind !== 'success') return
    const t = window.setTimeout(() => setUploadBanner(null), 4500)
    return () => window.clearTimeout(t)
  }, [uploadBanner])

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
          setUploadBanner(null)
          setIsUploadingPhoto(true)
          try {
            let id = workingId
            if (!id) {
              const res = await createCatalogItemDraft()
              id = res.id
              setWorkingId(id)
            }
            await uploadCatalogPhoto(id, file)
            await rowQuery.refetch()
            setUploadBanner({
              kind: 'success',
              message: `Файл «${file.name}» загружен.`,
            })
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Ошибка загрузки'
            setUploadBanner({ kind: 'error', message })
          } finally {
            setIsUploadingPhoto(false)
          }
        }}
      />

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {isEdit ? 'Редактировать товар' : 'Добавить товар'}
          </h1>
          <p className="mt-1 text-sm font-normal text-neutral-900 dark:text-neutral-300">
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
        <Card className="p-4 text-sm font-normal text-neutral-900 dark:text-neutral-200">Загружаем товар…</Card>
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
              <div
                className="rounded-2xl bg-violet-50 p-4 ring-1 ring-violet-200 dark:bg-neutral-950/60 dark:ring-white/10"
                aria-busy={isUploadingPhoto}
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-500/15 ring-1 ring-violet-400/30">
                    <LuImagePlus className="h-5 w-5 text-violet-700 dark:text-violet-200" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                      Загрузить фото
                    </div>
                    <div className="mt-0.5 text-xs font-normal text-neutral-700 dark:text-neutral-300">
                      JPG / PNG / WebP → S3, затем генерация на шаге 2.
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button
                    variant="secondary"
                    type="button"
                    disabled={isUploadingPhoto}
                    onClick={() => fileRef.current?.click()}
                  >
                    {isUploadingPhoto ? (
                      <>
                        <span
                          className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-800 dark:border-white/25 dark:border-t-white"
                          aria-hidden
                        />
                        Загрузка…
                      </>
                    ) : (
                      <>
                        <LuCloudUpload className="mr-2 h-4 w-4" />
                        Выбрать файл
                      </>
                    )}
                  </Button>
                  {isUploadingPhoto && (
                    <span className="text-xs font-normal text-neutral-700 dark:text-neutral-400">
                      Отправляем файл на сервер…
                    </span>
                  )}
                </div>
                {uploadBanner && (
                  <div
                    role="status"
                    className={[
                      'mt-3 flex items-start gap-2 rounded-xl px-3 py-2 text-xs ring-1',
                      uploadBanner.kind === 'success'
                        ? 'bg-emerald-50 text-emerald-900 ring-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-100 dark:ring-emerald-500/35'
                        : 'bg-red-50 text-red-900 ring-red-300 dark:bg-red-950/40 dark:text-red-100 dark:ring-red-500/35',
                    ].join(' ')}
                  >
                    {uploadBanner.kind === 'error' && (
                      <LuCircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    )}
                    {uploadBanner.kind === 'success' && (
                      <LuCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" aria-hidden />
                    )}
                    <span>{uploadBanner.message}</span>
                  </div>
                )}
                {photoPreviewUrl && (
                  <div className="relative mt-3 overflow-hidden rounded-xl ring-1 ring-white/10">
                    <img
                      src={photoPreviewUrl}
                      alt="Превью загруженного фото"
                      className="max-h-48 w-full object-contain bg-neutral-100 dark:bg-neutral-950"
                    />
                    {isUploadingPhoto && (
                      <div className="absolute inset-0 grid place-items-center bg-black/40 backdrop-blur-[2px] dark:bg-neutral-950/55">
                        <span className="text-xs font-medium text-white dark:text-neutral-100">
                          Обновляем превью…
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium">Данные</div>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <label className="text-xs font-normal text-neutral-800 dark:text-neutral-300">Название</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 ring-1 ring-neutral-200 dark:border-transparent dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:ring-white/10"
                    placeholder="Платье синее"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <label className="text-xs font-normal text-neutral-800 dark:text-neutral-300">Цена (TJS)</label>
                    <input
                      type="number"
                      value={priceTjs}
                      onChange={(e) => setPriceTjs(Number(e.target.value))}
                      className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 ring-1 ring-neutral-200 dark:border-transparent dark:bg-neutral-950 dark:text-neutral-50 dark:ring-white/10"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs font-normal text-neutral-800 dark:text-neutral-300">Категория</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 ring-1 ring-neutral-200 dark:border-transparent dark:bg-neutral-950 dark:text-neutral-50 dark:ring-white/10"
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
              <div className="mt-1 text-xs font-normal text-neutral-900 dark:text-neutral-300">
                GPT-4o-mini + DALL·E 3 (три полноформатных кадра). Занимает 1–3 минуты.
              </div>
              <div className="mt-3 rounded-xl bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-900 ring-1 ring-neutral-200 dark:bg-neutral-950/40 dark:text-neutral-300 dark:ring-white/10">
                Ниже четыре превью:{' '}
                <span className="font-medium text-neutral-950 dark:text-neutral-100">исходное фото</span> и три
                типажа (высокий / средний / плотный). Нажмите «Запустить» и дождитесь статуса
                генерации — затем откройте шаг «Публикация».
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

          <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
            {(['original', 'tall', 'mid', 'curvy'] as const).map((k) => (
              <div
                key={k}
                className={[
                  'h-28 w-full overflow-hidden rounded-xl ring-1 ring-neutral-200 sm:h-32 md:h-36 dark:ring-white/10',
                  isGenerating || rowQuery.data?.status === 'generating'
                    ? 'animate-pulse bg-neutral-200 dark:bg-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-950/60',
                ].join(' ')}
              >
                {!isGenerating && rowQuery.data?.status !== 'generating' && (
                  <img
                    src={tiles[k]}
                    alt={
                      k === 'original'
                        ? 'Оригинал'
                        : k === 'tall'
                          ? 'Типаж высокий'
                          : k === 'mid'
                            ? 'Типаж средний'
                            : 'Типаж плотный'
                    }
                    className="h-full w-full object-cover"
                  />
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
              <div className="mt-1 text-xs font-normal text-neutral-900 dark:text-neutral-300">
                Продавец видит оригинал + 3 типажа. Потом публикует.
              </div>
            </div>
            <Button
              onClick={async () => {
                if (!workingId) return
                await setCatalogStatus({ id: workingId, status: 'published' })
                showToast('Товар успешно опубликован')
                navigate('/catalog')
              }}
              disabled={!workingId}
            >
              Опубликовать
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
            {(
              [
                ['Оригинал', tiles.original],
                ['Высокий', tiles.tall],
                ['Средний', tiles.mid],
                ['Плотный', tiles.curvy],
              ] as const
            ).map(([label, url]) => (
              <div
                key={label}
                className="flex min-w-0 flex-col overflow-hidden rounded-xl ring-1 ring-neutral-200 dark:ring-white/10"
              >
                <div className="h-28 w-full shrink-0 overflow-hidden bg-neutral-100 sm:h-32 md:h-36 dark:bg-neutral-950">
                  <img src={url} alt={label} className="h-full w-full object-cover" />
                </div>
                <div className="truncate px-1 py-1 text-center text-[10px] font-normal text-neutral-900 sm:text-xs dark:text-neutral-300">
                  {label}
                </div>
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
              Новый товар (шаг 1)
            </Button>
            <Button variant="ghost" onClick={() => setStep(2)}>
              Перегенерировать
            </Button>
          </div>

          <div className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-700 dark:border-white/10 dark:bg-neutral-950/60 dark:text-neutral-300">
            «Новый товар» только очищает форму и возвращает к загрузке фото — без автоматической
            публикации текущей карточки. Чтобы текущий товар появился в витрине, нажмите «Опубликовать»
            выше.
          </div>

          <div className="mt-3 text-xs font-normal text-neutral-700 dark:text-neutral-400">
            {workingId ? `ID: ${workingId}` : 'ID появится после создания'} • {title || '—'} • {priceTjs}{' '}
            TJS • {category === 'tops' ? 'Топ' : category === 'bottoms' ? 'Низ' : 'Платья'}
          </div>
        </Card>
      )}
    </div>
  )
}
