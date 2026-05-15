import { useEffect, useRef, useState } from 'react'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import {
  generateHfImageDev,
  generateHfImg2ImgDev,
  getDashboardApiMode,
  getHfPrompt,
  saveHfPrompt,
} from '../../shared/api/api-client'

const DEFAULT_T2I_MODEL = 'black-forest-labs/FLUX.1-schnell'
const DEFAULT_I2I_MODEL = 'timbrooks/instruct-pix2pix'

const DEFAULT_CATALOG_PROMPT =
  'High-quality ecommerce fashion photography. ' +
  'Photorealistic {gender} fashion model wearing {garment}. ' +
  'Full body shot, naturally posed. Studio lighting, clean white background. ' +
  'Fashion catalog aesthetic, sharp focus, 4K quality.'

type Mode = 'text' | 'img2img'
type Gender = 'female' | 'male'

export function HfImageTestPage() {
  const [mode, setMode] = useState<Mode>('text')
  const [gender, setGender] = useState<Gender>('female')
  const [prompt, setPrompt] = useState(DEFAULT_CATALOG_PROMPT)
  const [modelId, setModelId] = useState(DEFAULT_T2I_MODEL)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [savedPrompt, setSavedPrompt] = useState('')
  const [savingPrompt, setSavingPrompt] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  useEffect(() => {
    getHfPrompt()
      .then((r) => setSavedPrompt(r.prompt || DEFAULT_CATALOG_PROMPT))
      .catch(() => setSavedPrompt(DEFAULT_CATALOG_PROMPT))
  }, [])

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [resultUrl, previewUrl])

  const handleModeSwitch = (m: Mode) => {
    setMode(m)
    setModelId(m === 'text' ? DEFAULT_T2I_MODEL : DEFAULT_I2I_MODEL)
    setError(null)
    setResultUrl(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  const handleGenerate = async () => {
    setError(null)
    if (getDashboardApiMode() === 'mock') {
      setError('В .env дашборда выставь VITE_API_MODE=real и VITE_API_BASE_URL на URL API.')
      return
    }
    if (mode === 'img2img' && !imageFile) {
      setError('Загрузи фото одежды.')
      return
    }
    setLoading(true)
    try {
      let blob: Blob
      const resolvedPrompt = prompt.trim().replace(/\{gender\}/g, gender)
      if (mode === 'text') {
        blob = await generateHfImageDev({ prompt: resolvedPrompt, modelId: modelId.trim() || undefined })
      } else {
        blob = await generateHfImg2ImgDev({ prompt: resolvedPrompt, image: imageFile!, modelId: modelId.trim() || undefined })
      }
      setResultUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return URL.createObjectURL(blob)
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  const handleSavePrompt = async () => {
    setSavingPrompt(true)
    setSaveMsg(null)
    try {
      await saveHfPrompt(savedPrompt)
      setSaveMsg('Сохранено ✓')
    } catch (e) {
      setSaveMsg(e instanceof Error ? e.message : 'Ошибка сохранения')
    } finally {
      setSavingPrompt(false)
    }
  }

  const i2iPrompt = 'Put this garment on a photorealistic fashion model, studio lighting, white background, full body'

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Тест Hugging Face (картинка)</h1>
        <p className="mt-1 text-sm font-normal text-neutral-600 dark:text-neutral-400">
          Нужен{' '}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs dark:bg-neutral-800">HUGGINGFACE_API_TOKEN</code>{' '}
          на сервере.
        </p>
      </header>

      {/* Saved catalog prompt */}
      <Card className="space-y-3 p-4">
        <div>
          <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
            Промпт для каталога
          </div>
          <div className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            Этот промпт ИИ использует при генерации карточек товара через HuggingFace.{' '}
            <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">{'{gender}'}</code>{' '}
            — пол модели (female / male).{' '}
            <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">{'{garment}'}</code>{' '}
            — описание загруженной одежды (GPT-4o-mini анализирует фото).
          </div>
        </div>
        <textarea
          rows={8}
          value={savedPrompt}
          onChange={(e) => { setSavedPrompt(e.target.value); setSaveMsg(null) }}
          className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 font-mono text-xs text-neutral-900 shadow-sm outline-none ring-violet-500/30 focus:ring-2 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50"
        />
        <div className="flex items-center gap-3">
          <Button
            type="button"
            disabled={savingPrompt || !savedPrompt.trim()}
            onClick={() => void handleSavePrompt()}
          >
            {savingPrompt ? 'Сохраняем…' : 'Сохранить промпт'}
          </Button>
          <button
            type="button"
            onClick={() => { setSavedPrompt(DEFAULT_CATALOG_PROMPT); setSaveMsg(null) }}
            className="text-xs text-neutral-500 underline hover:no-underline dark:text-neutral-400"
          >
            Сбросить по умолчанию
          </button>
          {saveMsg && (
            <span className={`text-xs ${saveMsg.includes('✓') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {saveMsg}
            </span>
          )}
        </div>
      </Card>

      {/* Test generation */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleModeSwitch('text')}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
            mode === 'text'
              ? 'bg-violet-600 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
          }`}
        >
          Текст → картинка
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch('img2img')}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
            mode === 'img2img'
              ? 'bg-violet-600 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
          }`}
        >
          Фото одежды → модель
        </button>
      </div>

      <Card className="space-y-4 p-4">
        {mode === 'img2img' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Фото одежды
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-neutral-700 dark:text-neutral-300"
            />
            {previewUrl && (
              <img src={previewUrl} alt="preview" className="max-h-48 rounded-xl object-contain" />
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100" htmlFor="hf-prompt">
            Промпт (тест)
          </label>
          <textarea
            id="hf-prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none ring-violet-500/30 focus:ring-2 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50"
          />
          {mode === 'img2img' && (
            <button
              type="button"
              onClick={() => setPrompt(i2iPrompt)}
              className="text-xs text-violet-600 underline hover:no-underline dark:text-violet-400"
            >
              Вставить промпт для одежды
            </button>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100" htmlFor="hf-model">
            Model id (HF репозиторий)
          </label>
          <input
            id="hf-model"
            type="text"
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none ring-violet-500/30 focus:ring-2 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
            Пол модели <span className="font-normal text-neutral-500">(подставится в {'{gender}'})</span>
          </label>
          <div className="flex gap-2">
            {(['female', 'male'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={[
                  'flex-1 rounded-xl px-3 py-2 text-sm font-medium ring-1 transition-colors',
                  gender === g
                    ? 'bg-violet-600 text-white ring-violet-500 dark:bg-violet-500 dark:ring-violet-400'
                    : 'bg-white text-neutral-900 ring-neutral-200 hover:bg-neutral-50 dark:bg-neutral-950 dark:text-neutral-50 dark:ring-white/10',
                ].join(' ')}
              >
                {g === 'female' ? '♀ Женский' : '♂ Мужской'}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="button"
          disabled={loading || !prompt.trim() || (mode === 'img2img' && !imageFile)}
          onClick={() => void handleGenerate()}
        >
          {loading ? 'Генерация…' : 'Сгенерировать'}
        </Button>

        {error ? (
          <p className="whitespace-pre-wrap rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
            {error}
          </p>
        ) : null}
      </Card>

      {resultUrl ? (
        <Card className="overflow-hidden p-0">
          <img src={resultUrl} alt="Результат генерации" className="max-h-[min(80vh,900px)] w-full object-contain" />
        </Card>
      ) : null}
    </div>
  )
}
