import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import {
  useShopProfileQuery,
  useUpdateShopProfileMutation,
  useUploadShopLogoMutation,
} from '../../shared/api/queries'
import { passwordChangeConfirm, passwordChangeStart } from '../../shared/api/api-client'
import { LuImagePlus } from 'react-icons/lu'

function ChangePasswordCard() {
  const [step, setStep] = useState<'form' | 'code'>('form')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPassword2, setNewPassword2] = useState('')
  const [changeRequestId, setChangeRequestId] = useState('')
  const [code, setCode] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const startMut = useMutation({
    mutationFn: async () => {
      if (newPassword.length < 8) throw new Error('Минимум 8 символов')
      if (newPassword !== newPassword2) throw new Error('Пароли не совпадают')
      return passwordChangeStart(currentPassword, newPassword)
    },
    onSuccess: (id) => {
      setChangeRequestId(id)
      setStep('code')
      setLocalError(null)
    },
    onError: (e: Error) => setLocalError(e.message),
  })

  const confirmMut = useMutation({
    mutationFn: () => passwordChangeConfirm(changeRequestId, code.replace(/\s/g, '')),
    onSuccess: () => {
      setStep('form')
      setCurrentPassword('')
      setNewPassword('')
      setNewPassword2('')
      setCode('')
      setChangeRequestId('')
      setLocalError(null)
    },
    onError: (e: Error) => setLocalError(e.message),
  })

  return (
    <Card className="mt-4 p-5">
      <div className="text-sm font-semibold">Смена пароля</div>
      <p className="mt-1 text-xs font-normal text-neutral-700 dark:text-neutral-400">
        После проверки текущего пароля на почту придёт код подтверждения (если SMTP настроен на сервере).
      </p>

      {step === 'form' ? (
        <div className="mt-4 grid max-w-md gap-3">
          <input
            type="password"
            placeholder="Текущий пароль"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50"
          />
          <input
            type="password"
            placeholder="Новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50"
          />
          <input
            type="password"
            placeholder="Повтор нового пароля"
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
            autoComplete="new-password"
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50"
          />
          {localError && <div className="text-xs text-red-600 dark:text-red-400">{localError}</div>}
          <Button
            type="button"
            disabled={startMut.isPending || !currentPassword || !newPassword || !newPassword2}
            onClick={() => startMut.mutate()}
          >
            {startMut.isPending ? 'Отправка кода…' : 'Отправить код на почту'}
          </Button>
        </div>
      ) : (
        <div className="mt-4 grid max-w-md gap-3">
          <input
            inputMode="numeric"
            placeholder="Код из письма"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm tracking-widest dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50"
          />
          {localError && <div className="text-xs text-red-600 dark:text-red-400">{localError}</div>}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={confirmMut.isPending || code.trim().length < 4}
              onClick={() => confirmMut.mutate()}
            >
              {confirmMut.isPending ? 'Сохранение…' : 'Подтвердить'}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setStep('form')
                setLocalError(null)
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

export function ShopProfilePage() {
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
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Магазин</h1>
        <p className="mt-1 text-sm font-normal text-neutral-900 dark:text-neutral-400">
          Логотип и текст о магазине показываются в админке и могут использоваться на витрине (Mini App).
        </p>
      </header>

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
        <>
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
          <ChangePasswordCard />
        </>
      )}
    </div>
  )
}
