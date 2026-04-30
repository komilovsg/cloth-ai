import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import {
  useAuthMeQuery,
  useShopProfileQuery,
  useUpdateShopProfileMutation,
  useUploadShopLogoMutation,
} from '../../shared/api/queries'
import {
  passwordChangeConfirm,
  passwordChangeStart,
  passwordRecoveryConfirm,
  passwordRecoveryStart,
} from '../../shared/api/api-client'
import { LuEye, LuEyeOff, LuImagePlus } from 'react-icons/lu'

const MIN_PASSWORD_LEN = 8

function PasswordRevealInput({
  placeholder,
  value,
  onChange,
  visible,
  onToggleVisible,
  autoComplete,
  error,
}: {
  placeholder: string
  value: string
  onChange: (v: string) => void
  visible: boolean
  onToggleVisible: () => void
  autoComplete?: string
  error?: string
}) {
  return (
    <div className="grid gap-1">
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className={[
            'w-full rounded-xl border bg-white px-3 py-2 pr-11 text-sm text-neutral-900 placeholder:text-neutral-500 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder:text-neutral-500',
            error
              ? 'border-red-400 ring-2 ring-red-400/25 dark:border-red-500 dark:ring-red-500/25'
              : 'border-neutral-200 ring-1 ring-neutral-200 dark:border-white/10 dark:ring-white/10',
          ].join(' ')}
        />
        <button
          type="button"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/10"
          aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
          onClick={onToggleVisible}
        >
          {visible ? <LuEyeOff className="h-4 w-4" aria-hidden /> : <LuEye className="h-4 w-4" aria-hidden />}
        </button>
      </div>
      {error ? <p className="text-xs text-red-600 dark:text-red-400">{error}</p> : null}
    </div>
  )
}

export function ChangePasswordCard() {
  const authMe = useAuthMeQuery()
  const email = authMe.data?.email?.trim() ?? ''

  const [flow, setFlow] = useState<'change' | 'recover'>('change')
  const [step, setStep] = useState<'form' | 'code'>('form')
  const [recoverStep, setRecoverStep] = useState<'intro' | 'set'>('intro')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPassword2, setNewPassword2] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew1, setShowNew1] = useState(false)
  const [showNew2, setShowNew2] = useState(false)

  const [recoverNew1, setRecoverNew1] = useState('')
  const [recoverNew2, setRecoverNew2] = useState('')
  const [showRv1, setShowRv1] = useState(false)
  const [showRv2, setShowRv2] = useState(false)

  const [changeRequestId, setChangeRequestId] = useState('')
  const [code, setCode] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    current?: string
    newPwd?: string
    newPwd2?: string
    code?: string
    rv1?: string
    rv2?: string
  }>({})

  function resetRecoverFields() {
    setRecoverStep('intro')
    setRecoverNew1('')
    setRecoverNew2('')
    setChangeRequestId('')
    setCode('')
    setShowRv1(false)
    setShowRv2(false)
  }

  function resetChangeFields() {
    setStep('form')
    setCurrentPassword('')
    setNewPassword('')
    setNewPassword2('')
    setCode('')
    setChangeRequestId('')
    setShowCurrent(false)
    setShowNew1(false)
    setShowNew2(false)
  }

  const startMut = useMutation({
    mutationFn: async () => passwordChangeStart(currentPassword, newPassword),
    onSuccess: (id) => {
      setChangeRequestId(id)
      setStep('code')
      setLocalError(null)
      setFieldErrors({})
    },
    onError: (e: Error) => setLocalError(e.message),
  })

  const confirmMut = useMutation({
    mutationFn: () => passwordChangeConfirm(changeRequestId, code.replace(/\s/g, '')),
    onSuccess: () => {
      resetChangeFields()
      setLocalError(null)
      setFieldErrors({})
    },
    onError: (e: Error) => setLocalError(e.message),
  })

  const recoveryStartMut = useMutation({
    mutationFn: () => passwordRecoveryStart(),
    onSuccess: (id) => {
      setChangeRequestId(id)
      setRecoverStep('set')
      setLocalError(null)
      setFieldErrors({})
    },
    onError: (e: Error) => setLocalError(e.message),
  })

  const recoveryConfirmMut = useMutation({
    mutationFn: () =>
      passwordRecoveryConfirm(changeRequestId, code.replace(/\s/g, ''), recoverNew1),
    onSuccess: () => {
      setFlow('change')
      resetChangeFields()
      resetRecoverFields()
      setLocalError(null)
      setFieldErrors({})
    },
    onError: (e: Error) => setLocalError(e.message),
  })

  function validateChangeForm(): boolean {
    const errs: typeof fieldErrors = {}
    if (!currentPassword) errs.current = 'Введите текущий пароль'
    if (newPassword.length < MIN_PASSWORD_LEN) {
      errs.newPwd = `Минимум ${MIN_PASSWORD_LEN} символов`
    }
    if (newPassword !== newPassword2) errs.newPwd2 = 'Пароли должны совпадать'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  function validateRecoverSet(): boolean {
    const errs: typeof fieldErrors = {}
    const c = code.replace(/\s/g, '')
    if (c.length < 6) errs.code = 'Введите код из письма (обычно 6 цифр)'
    if (recoverNew1.length < MIN_PASSWORD_LEN) errs.rv1 = `Минимум ${MIN_PASSWORD_LEN} символов`
    if (recoverNew1 !== recoverNew2) errs.rv2 = 'Пароли должны совпадать'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  return (
    <Card className="p-5">
      <div className="text-sm font-semibold">Смена пароля</div>
      <p className="mt-1 text-xs font-normal text-neutral-700 dark:text-neutral-400">
        Знаете текущий пароль — введите его и новый пароль: на почту уйдёт код подтверждения (если настроена SMTP).
        Если текущий пароль не помните — используйте вариант ниже с кодом без старого пароля или страницу «Забыли пароль»
        без входа в аккаунт.
      </p>

      {flow === 'change' ? (
        <>
          {step === 'form' ? (
            <div className="mt-4 grid max-w-md gap-3">
              <PasswordRevealInput
                placeholder="Текущий пароль"
                value={currentPassword}
                onChange={(v) => {
                  setCurrentPassword(v)
                  setFieldErrors((p) => ({ ...p, current: undefined }))
                }}
                visible={showCurrent}
                onToggleVisible={() => setShowCurrent((s) => !s)}
                autoComplete="current-password"
                error={fieldErrors.current}
              />
              <PasswordRevealInput
                placeholder="Новый пароль"
                value={newPassword}
                onChange={(v) => {
                  setNewPassword(v)
                  setFieldErrors((p) => ({ ...p, newPwd: undefined }))
                }}
                visible={showNew1}
                onToggleVisible={() => setShowNew1((s) => !s)}
                autoComplete="new-password"
                error={fieldErrors.newPwd}
              />
              <PasswordRevealInput
                placeholder="Повтор нового пароля"
                value={newPassword2}
                onChange={(v) => {
                  setNewPassword2(v)
                  setFieldErrors((p) => ({ ...p, newPwd2: undefined }))
                }}
                visible={showNew2}
                onToggleVisible={() => setShowNew2((s) => !s)}
                autoComplete="new-password"
                error={fieldErrors.newPwd2}
              />
              {localError ? <div className="text-xs text-red-600 dark:text-red-400">{localError}</div> : null}
              <Button
                type="button"
                disabled={startMut.isPending || !currentPassword || !newPassword || !newPassword2}
                onClick={() => {
                  setLocalError(null)
                  if (!validateChangeForm()) return
                  startMut.mutate()
                }}
              >
                {startMut.isPending ? 'Отправка кода…' : 'Отправить код на почту'}
              </Button>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-normal">
                <button
                  type="button"
                  className="text-violet-600 underline decoration-violet-600/40 underline-offset-2 hover:opacity-90 dark:text-violet-400 dark:decoration-violet-400/40"
                  onClick={() => {
                    setFlow('recover')
                    resetRecoverFields()
                    setLocalError(null)
                    setFieldErrors({})
                  }}
                >
                  Не помню текущий пароль
                </button>
                <span className="text-neutral-400 dark:text-neutral-500">·</span>
                <Link
                  to="/forgot-password"
                  className="text-violet-600 underline decoration-violet-600/40 underline-offset-2 hover:opacity-90 dark:text-violet-400 dark:decoration-violet-400/40"
                >
                  Забыли пароль? (выйти и сбросить по ссылке)
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid max-w-md gap-3">
              <div className="grid gap-1">
                <input
                  inputMode="numeric"
                  placeholder="Код из письма"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value)
                    setFieldErrors((p) => ({ ...p, code: undefined }))
                  }}
                  autoComplete="one-time-code"
                  className={[
                    'rounded-xl border bg-white px-3 py-2 text-sm tracking-widest dark:bg-neutral-950 dark:text-neutral-50',
                    fieldErrors.code
                      ? 'border-red-400 ring-2 ring-red-400/25 dark:border-red-500'
                      : 'border-neutral-200 ring-1 ring-neutral-200 dark:border-white/10 dark:ring-white/10',
                  ].join(' ')}
                />
                {fieldErrors.code ? (
                  <p className="text-xs text-red-600 dark:text-red-400">{fieldErrors.code}</p>
                ) : null}
              </div>
              {localError ? <div className="text-xs text-red-600 dark:text-red-400">{localError}</div> : null}
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  disabled={confirmMut.isPending || code.trim().length < 4}
                  onClick={() => {
                    setLocalError(null)
                    confirmMut.mutate()
                  }}
                >
                  {confirmMut.isPending ? 'Сохранение…' : 'Подтвердить'}
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    setStep('form')
                    setLocalError(null)
                    setFieldErrors({})
                  }}
                >
                  Назад
                </Button>
              </div>
            </div>
          )}
        </>
      ) : recoverStep === 'intro' ? (
        <div className="mt-4 grid max-w-md gap-3">
          <p className="text-xs font-normal text-neutral-700 dark:text-neutral-400">
            Отправим код на{' '}
            <span className="font-medium text-neutral-900 dark:text-neutral-200">{email || 'ваш email'}</span>.
            Затем введите код и новый пароль дважды. Действует только для аккаунта, в который вы уже вошли.
          </p>
          {localError ? <div className="text-xs text-red-600 dark:text-red-400">{localError}</div> : null}
          <Button type="button" disabled={recoveryStartMut.isPending || !email} onClick={() => recoveryStartMut.mutate()}>
            {recoveryStartMut.isPending ? 'Отправка…' : 'Отправить код'}
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              setFlow('change')
              resetRecoverFields()
              setLocalError(null)
              setFieldErrors({})
            }}
          >
            У меня есть текущий пароль
          </Button>
          <Link
            to="/forgot-password"
            className="text-xs text-violet-600 underline decoration-violet-600/40 underline-offset-2 dark:text-violet-400"
          >
            Нет доступа к почте этого аккаунта — сброс через «Забыли пароль»
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid max-w-md gap-3">
          <div className="grid gap-1">
            <input
              inputMode="numeric"
              placeholder="Код из письма"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setFieldErrors((p) => ({ ...p, code: undefined }))
              }}
              autoComplete="one-time-code"
              className={[
                'rounded-xl border bg-white px-3 py-2 text-sm tracking-widest dark:bg-neutral-950 dark:text-neutral-50',
                fieldErrors.code
                  ? 'border-red-400 ring-2 ring-red-400/25 dark:border-red-500'
                  : 'border-neutral-200 ring-1 ring-neutral-200 dark:border-white/10 dark:ring-white/10',
              ].join(' ')}
            />
            {fieldErrors.code ? (
              <p className="text-xs text-red-600 dark:text-red-400">{fieldErrors.code}</p>
            ) : null}
          </div>
          <PasswordRevealInput
            placeholder="Новый пароль"
            value={recoverNew1}
            onChange={(v) => {
              setRecoverNew1(v)
              setFieldErrors((p) => ({ ...p, rv1: undefined }))
            }}
            visible={showRv1}
            onToggleVisible={() => setShowRv1((s) => !s)}
            autoComplete="new-password"
            error={fieldErrors.rv1}
          />
          <PasswordRevealInput
            placeholder="Повтор нового пароля"
            value={recoverNew2}
            onChange={(v) => {
              setRecoverNew2(v)
              setFieldErrors((p) => ({ ...p, rv2: undefined }))
            }}
            visible={showRv2}
            onToggleVisible={() => setShowRv2((s) => !s)}
            autoComplete="new-password"
            error={fieldErrors.rv2}
          />
          {localError ? <div className="text-xs text-red-600 dark:text-red-400">{localError}</div> : null}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={recoveryConfirmMut.isPending}
              onClick={() => {
                setLocalError(null)
                if (!validateRecoverSet()) return
                recoveryConfirmMut.mutate()
              }}
            >
              {recoveryConfirmMut.isPending ? 'Сохранение…' : 'Сохранить новый пароль'}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setRecoverStep('intro')
                setCode('')
                setRecoverNew1('')
                setRecoverNew2('')
                setChangeRequestId('')
                setLocalError(null)
                setFieldErrors({})
              }}
            >
              Назад
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

/** Логотип и тексты витрины для администратора магазина (seller_admin / имперсонация). */
export function ShopVitrineEditor() {
  const profileQ = useShopProfileQuery()
  const updateProfile = useUpdateShopProfileMutation()
  const uploadLogo = useUploadShopLogoMutation()
  const fileRef = useRef<HTMLInputElement>(null)

  const [shopName, setShopName] = useState('')
  const [aboutText, setAboutText] = useState('')

  useEffect(() => {
    const d = profileQ.data
    if (!d) return
    setShopName(d.shopName)
    setAboutText(d.aboutText ?? '')
  }, [profileQ.data])

  const logoUrl = profileQ.data?.logoUrl

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Витрина магазина</h2>
        <p className="mt-1 text-sm font-normal text-neutral-900 dark:text-neutral-400">
          Логотип и текст показываются в админке и могут использоваться на витрине (Mini App).
        </p>
      </div>

      {profileQ.isLoading && (
        <Card className="p-4 text-sm font-normal text-neutral-900 dark:text-neutral-300">
          Загружаем профиль…
        </Card>
      )}
      {profileQ.isError && (
        <Card className="p-4">
          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            Не удалось загрузить профиль
          </div>
          <div className="mt-3">
            <Button variant="secondary" type="button" onClick={() => profileQ.refetch()}>
              Повторить
            </Button>
          </div>
        </Card>
      )}

      {!profileQ.isLoading && !profileQ.isError && (
        <Card className="p-5">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              e.target.value = ''
              if (!file) return
              uploadLogo.mutate(file)
            }}
          />

          <div className="text-sm font-semibold">Логотип</div>
          <p className="mt-1 text-xs font-normal text-neutral-700 dark:text-neutral-400">
            JPG / PNG / WebP. Загрузка на S3 — те же настройки, что для фото товаров.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div
              className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-neutral-200 dark:bg-neutral-950/60 dark:ring-white/10"
              aria-hidden
            >
              {logoUrl ? (
                <img src={logoUrl} alt="Предпросмотр логотипа" className="h-full w-full object-cover" />
              ) : (
                <LuImagePlus className="h-8 w-8 text-neutral-400 dark:text-neutral-500" />
              )}
            </div>
            <Button
              variant="secondary"
              type="button"
              disabled={uploadLogo.isPending}
              onClick={() => fileRef.current?.click()}
            >
              {uploadLogo.isPending ? 'Загрузка…' : 'Выбрать файл'}
            </Button>
          </div>
          {uploadLogo.isError && (
            <div className="mt-2 text-xs text-red-600 dark:text-red-400">
              {(uploadLogo.error as Error)?.message ?? 'Ошибка загрузки'}
            </div>
          )}

          <div className="mt-8 grid gap-4">
            <div className="grid gap-2">
              <label className="text-xs font-normal text-neutral-800 dark:text-neutral-300">
                Название магазина
              </label>
              <input
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Например: CLOTH.AI Studio"
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 ring-1 ring-neutral-200 dark:border-transparent dark:bg-neutral-950 dark:text-neutral-50 dark:ring-white/10"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-normal text-neutral-800 dark:text-neutral-300">
                О магазине
              </label>
              <textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                placeholder="Кратко опишите магазин, условия доставки или контакты."
                rows={5}
                className="resize-y rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 ring-1 ring-neutral-200 dark:border-transparent dark:bg-neutral-950 dark:text-neutral-50 dark:ring-white/10"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={updateProfile.isPending}
              onClick={() => updateProfile.mutate({ shopName, aboutText })}
            >
              {updateProfile.isPending ? 'Сохраняем…' : 'Сохранить текст'}
            </Button>
          </div>
          {updateProfile.isError && (
            <div className="mt-2 text-xs text-red-600 dark:text-red-400">
              {(updateProfile.error as Error)?.message ?? 'Ошибка сохранения'}
            </div>
          )}

          {profileQ.data?.updatedAtIso && (
            <div className="mt-4 text-[11px] font-normal text-neutral-500 dark:text-neutral-500">
              Обновлено: {new Date(profileQ.data.updatedAtIso).toLocaleString()}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
