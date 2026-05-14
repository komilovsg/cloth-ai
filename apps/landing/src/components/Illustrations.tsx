import type { SVGProps } from 'react'

type SvgProps = SVGProps<SVGSVGElement>

/** Phone frame mock — Telegram Mini App product page */
export function IllustrMiniApp(props: SvgProps) {
  return (
    <svg viewBox="0 0 320 560" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="tg-hdr" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="model-grad" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#1e3a5f" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="btn-grad" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
        <clipPath id="phone-clip">
          <rect x="20" y="8" width="280" height="544" rx="36" />
        </clipPath>
      </defs>

      {/* Phone body */}
      <rect x="20" y="8" width="280" height="544" rx="36" fill="#0f172a" stroke="#334155" strokeWidth="2" />
      <rect x="20" y="8" width="280" height="544" rx="36" fill="none" stroke="#1e293b" strokeWidth="1" />

      {/* Screen content (clipped) */}
      <g clipPath="url(#phone-clip)">
        {/* Telegram header */}
        <rect x="20" y="8" width="280" height="52" fill="url(#tg-hdr)" />
        <circle cx="52" cy="34" r="14" fill="rgba(255,255,255,0.15)" />
        <text x="52" y="39" textAnchor="middle" fill="white" fontSize="11" fontFamily="system-ui">С</text>
        <rect x="74" y="24" width="80" height="8" rx="4" fill="rgba(255,255,255,0.9)" />
        <rect x="74" y="37" width="52" height="6" rx="3" fill="rgba(255,255,255,0.5)" />
        {/* Back arrow */}
        <path d="M32 34L40 28M32 34L40 40" stroke="white" strokeWidth="2" strokeLinecap="round" />

        {/* Model image area */}
        <rect x="20" y="60" width="280" height="240" fill="url(#model-grad)" />
        {/* Stylized model silhouette */}
        <ellipse cx="160" cy="110" rx="22" ry="26" fill="#1e3a5f" stroke="#3b82f6" strokeOpacity="0.4" strokeWidth="1" />
        <path d="M115 280 Q138 160 160 148 Q182 160 205 280Z" fill="#1d3461" stroke="#3b82f6" strokeOpacity="0.3" strokeWidth="1" />
        {/* Clothing highlight */}
        <path d="M138 180 Q160 170 182 180 L185 260 Q160 268 135 260Z" fill="#2563eb" opacity="0.7" />
        <path d="M138 180 Q160 170 182 180" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
        {/* AI badge */}
        <rect x="24" y="64" width="56" height="20" rx="6" fill="rgba(37,99,235,0.85)" />
        <text x="52" y="78" textAnchor="middle" fill="white" fontSize="9" fontFamily="system-ui" fontWeight="600">AI-образ</text>
        {/* Size indicators top-right */}
        <circle cx="273" cy="74" r="10" fill="rgba(255,255,255,0.1)" />
        <circle cx="273" cy="98" r="10" fill="rgba(255,255,255,0.1)" />
        <path d="M269 74l2 2 4-4" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M269 98l4-4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />

        {/* Product info card */}
        <rect x="20" y="295" width="280" height="265" fill="#0f172a" />
        {/* Title */}
        <rect x="32" y="308" width="140" height="10" rx="5" fill="#e2e8f0" />
        <rect x="32" y="324" width="96" height="8" rx="4" fill="#94a3b8" />
        {/* Price */}
        <rect x="220" y="308" width="68" height="14" rx="5" fill="#dbeafe" />
        <text x="254" y="320" textAnchor="middle" fill="#1d4ed8" fontSize="10" fontFamily="system-ui" fontWeight="700">449 c.</text>

        {/* Size label */}
        <text x="32" y="356" fill="#64748b" fontSize="9" fontFamily="system-ui">РАЗМЕР</text>
        {/* Size buttons */}
        {(['S','M','L','XL'] as const).map((s, i) => (
          <g key={s}>
            <rect
              x={32 + i * 58}
              y={362}
              width="44"
              height="32"
              rx="8"
              fill={s === 'M' ? '#2563eb' : 'none'}
              stroke={s === 'M' ? '#3b82f6' : '#334155'}
              strokeWidth="1.5"
            />
            <text
              x={32 + i * 58 + 22}
              y={383}
              textAnchor="middle"
              fill={s === 'M' ? 'white' : '#94a3b8'}
              fontSize="11"
              fontFamily="system-ui"
              fontWeight={s === 'M' ? '600' : '400'}
            >{s}</text>
          </g>
        ))}

        {/* Model type */}
        <text x="32" y="418" fill="#64748b" fontSize="9" fontFamily="system-ui">МОДЕЛЬ</text>
        <rect x="32" y="424" width="72" height="24" rx="6" fill="#1e3a5f" stroke="#3b82f6" strokeOpacity="0.5" strokeWidth="1" />
        <rect x="112" y="424" width="72" height="24" rx="6" fill="none" stroke="#334155" strokeWidth="1" />
        <rect x="192" y="424" width="72" height="24" rx="6" fill="none" stroke="#334155" strokeWidth="1" />
        <text x="68" y="440" textAnchor="middle" fill="#93c5fd" fontSize="9" fontFamily="system-ui">Высокая</text>
        <text x="148" y="440" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="system-ui">Средняя</text>
        <text x="228" y="440" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="system-ui">Плотная</text>

        {/* CTA button */}
        <rect x="32" y="464" width="256" height="44" rx="12" fill="url(#btn-grad)" />
        <text x="160" y="491" textAnchor="middle" fill="white" fontSize="13" fontFamily="system-ui" fontWeight="600">Добавить в корзину</text>
      </g>

      {/* Notch */}
      <rect x="120" y="8" width="80" height="16" rx="8" fill="#0f172a" />
      <circle cx="160" cy="16" r="3" fill="#1e293b" />

      {/* Side buttons */}
      <rect x="16" y="140" width="4" height="40" rx="2" fill="#334155" />
      <rect x="16" y="190" width="4" height="30" rx="2" fill="#334155" />
      <rect x="300" y="160" width="4" height="50" rx="2" fill="#334155" />
    </svg>
  )
}

/** Browser frame mock — Admin catalog wizard */
export function IllustrCatalogWizard(props: SvgProps) {
  return (
    <svg viewBox="0 0 560 380" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="cw-step-active" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="cw-btn" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
      </defs>

      {/* Browser frame */}
      <rect x="0" y="0" width="560" height="380" rx="14" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />

      {/* Browser chrome */}
      <rect x="0" y="0" width="560" height="40" rx="14" fill="#111827" />
      <rect x="0" y="26" width="560" height="14" fill="#111827" />
      {/* Traffic lights */}
      <circle cx="20" cy="20" r="5" fill="#ef4444" opacity="0.7" />
      <circle cx="36" cy="20" r="5" fill="#f59e0b" opacity="0.7" />
      <circle cx="52" cy="20" r="5" fill="#22c55e" opacity="0.7" />
      {/* URL bar */}
      <rect x="80" y="12" width="400" height="16" rx="5" fill="#1e293b" />
      <text x="280" y="24" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="system-ui">dashboard.cloth.ai / catalog / new</text>

      {/* Sidebar */}
      <rect x="0" y="40" width="56" height="340" fill="#111827" />
      {[60, 108, 156, 204, 252].map((y, i) => (
        <g key={y}>
          <rect x="12" y={y} width="32" height="32" rx="8" fill={i === 2 ? 'rgba(37,99,235,0.2)' : 'transparent'} />
          <rect x="20" y={y + 8} width="16" height="3" rx="1.5" fill={i === 2 ? '#3b82f6' : '#334155'} />
          <rect x="20" y={y + 14} width="12" height="3" rx="1.5" fill={i === 2 ? '#3b82f6' : '#334155'} />
          <rect x="20" y={y + 20} width="16" height="3" rx="1.5" fill={i === 2 ? '#3b82f6' : '#334155'} />
        </g>
      ))}

      {/* Main content */}
      <rect x="56" y="40" width="504" height="340" fill="#0f172a" />

      {/* Page title */}
      <rect x="76" y="56" width="130" height="10" rx="5" fill="#e2e8f0" />
      <rect x="76" y="72" width="90" height="7" rx="3" fill="#475569" />

      {/* Step indicator */}
      <g>
        {/* Step 1 — completed */}
        <circle cx="200" cy="64" r="12" fill="#2563eb" />
        <path d="M195 64l4 4 7-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="212" y="63" width="40" height="2" rx="1" fill="#2563eb" />
        {/* Step 2 — active */}
        <circle cx="256" cy="64" r="12" fill="url(#cw-step-active)" />
        <text x="256" y="68" textAnchor="middle" fill="white" fontSize="11" fontFamily="system-ui" fontWeight="700">2</text>
        <rect x="268" y="63" width="40" height="2" rx="1" fill="#334155" />
        {/* Step 3 */}
        <circle cx="312" cy="64" r="12" fill="none" stroke="#334155" strokeWidth="1.5" />
        <text x="312" y="68" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="system-ui">3</text>
      </g>

      {/* Two-column layout */}
      {/* Left — uploaded photo */}
      <rect x="76" y="96" width="200" height="240" rx="12" fill="#111827" stroke="#1e293b" strokeWidth="1" />
      {/* Photo placeholder with model */}
      <rect x="88" y="108" width="176" height="192" rx="8" fill="#1e3a5f" />
      <ellipse cx="176" cy="150" rx="24" ry="28" fill="#1d3461" stroke="#3b82f6" strokeOpacity="0.35" strokeWidth="1" />
      <path d="M136 300 Q155 200 176 188 Q197 200 216 300Z" fill="#1d3461" stroke="#3b82f6" strokeOpacity="0.25" strokeWidth="1" />
      <path d="M152 224 Q176 214 200 224 L202 284 Q176 292 150 284Z" fill="#2563eb" opacity="0.65" />
      <rect x="90" y="110" width="60" height="18" rx="5" fill="rgba(37,99,235,0.8)" />
      <text x="120" y="123" textAnchor="middle" fill="white" fontSize="9" fontFamily="system-ui" fontWeight="600">Загружено ✓</text>

      {/* Right — form */}
      <rect x="292" y="96" width="248" height="240" rx="12" fill="#111827" stroke="#1e293b" strokeWidth="1" />
      {/* Form fields */}
      <text x="308" y="122" fill="#94a3b8" fontSize="9" fontFamily="system-ui">НАЗВАНИЕ ТОВАРА</text>
      <rect x="308" y="128" width="216" height="28" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <rect x="314" y="137" width="120" height="8" rx="4" fill="#475569" />

      <text x="308" y="176" fill="#94a3b8" fontSize="9" fontFamily="system-ui">ЦЕНА (сомони)</text>
      <rect x="308" y="182" width="100" height="28" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <rect x="314" y="191" width="48" height="8" rx="4" fill="#475569" />

      <text x="308" y="230" fill="#94a3b8" fontSize="9" fontFamily="system-ui">КАТЕГОРИЯ</text>
      <rect x="308" y="236" width="216" height="28" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <rect x="314" y="245" width="80" height="8" rx="4" fill="#475569" />
      <path d="M506 250l-5-4-5 4" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Gender toggle */}
      <text x="308" y="284" fill="#94a3b8" fontSize="9" fontFamily="system-ui">ПОЛ</text>
      <rect x="308" y="290" width="96" height="28" rx="6" fill="rgba(37,99,235,0.2)" stroke="#3b82f6" strokeOpacity="0.5" strokeWidth="1" />
      <text x="356" y="308" textAnchor="middle" fill="#93c5fd" fontSize="10" fontFamily="system-ui">♀ Женский</text>
      <rect x="412" y="290" width="96" height="28" rx="6" fill="none" stroke="#334155" strokeWidth="1" />
      <text x="460" y="308" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="system-ui">♂ Мужской</text>

      {/* CTA */}
      <rect x="76" y="350" width="464" height="20" rx="0" fill="none" />
      <rect x="76" y="346" width="200" height="36" rx="10" fill="url(#cw-btn)" />
      <text x="176" y="369" textAnchor="middle" fill="white" fontSize="11" fontFamily="system-ui" fontWeight="600">✨ Создать AI-образ</text>
      <rect x="292" y="346" width="248" height="36" rx="10" fill="none" stroke="#334155" strokeWidth="1" />
      <text x="416" y="369" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="system-ui">Назад</text>
    </svg>
  )
}

/** Browser frame mock — Admin orders CRM */
export function IllustrOrders(props: SvgProps) {
  const statuses = [
    { label: 'Зарезервирован', fill: '#854d0e', stroke: '#ca8a04', dot: '#facc15', name: 'Платье синее', id: '#1042', total: '399 с.' },
    { label: 'Подтверждён', fill: '#14532d', stroke: '#16a34a', dot: '#4ade80', name: 'Топ чёрный + Легинсы', id: '#1041', total: '448 с.' },
    { label: 'Отменён', fill: '#450a0a', stroke: '#dc2626', dot: '#f87171', name: 'Платье бежевое', id: '#1040', total: '349 с.' },
  ]

  return (
    <svg viewBox="0 0 560 340" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="ord-sidebar" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#111827" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Browser frame */}
      <rect width="560" height="340" rx="14" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />
      <rect width="560" height="40" rx="14" fill="#111827" />
      <rect y="26" width="560" height="14" fill="#111827" />
      <circle cx="20" cy="20" r="5" fill="#ef4444" opacity="0.7" />
      <circle cx="36" cy="20" r="5" fill="#f59e0b" opacity="0.7" />
      <circle cx="52" cy="20" r="5" fill="#22c55e" opacity="0.7" />
      <rect x="80" y="12" width="400" height="16" rx="5" fill="#1e293b" />
      <text x="280" y="24" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="system-ui">dashboard.cloth.ai / orders</text>

      {/* Sidebar */}
      <rect y="40" width="56" height="300" fill="url(#ord-sidebar)" />
      {[60, 108, 156, 204].map((y, i) => (
        <g key={y}>
          <rect x="12" y={y} width="32" height="32" rx="8" fill={i === 1 ? 'rgba(37,99,235,0.2)' : 'transparent'} />
          <rect x="20" y={y + 8} width="16" height="3" rx="1.5" fill={i === 1 ? '#3b82f6' : '#334155'} />
          <rect x="20" y={y + 14} width="12" height="3" rx="1.5" fill={i === 1 ? '#3b82f6' : '#334155'} />
          <rect x="20" y={y + 20} width="16" height="3" rx="1.5" fill={i === 1 ? '#3b82f6' : '#334155'} />
        </g>
      ))}

      {/* Main area */}
      <rect x="56" y="40" width="504" height="300" fill="#0f172a" />

      {/* Header row */}
      <rect x="56" y="40" width="504" height="48" fill="#111827" />
      <rect x="76" y="52" width="96" height="10" rx="5" fill="#e2e8f0" />
      <rect x="76" y="67" width="60" height="7" rx="3" fill="#475569" />
      <rect x="440" y="50" width="100" height="28" rx="8" fill="rgba(37,99,235,0.15)" stroke="#3b82f6" strokeOpacity="0.4" strokeWidth="1" />
      <text x="490" y="68" textAnchor="middle" fill="#60a5fa" fontSize="10" fontFamily="system-ui">+ Новый заказ</text>

      {/* Table header */}
      <rect x="56" y="88" width="504" height="28" fill="#111827" />
      {['ЗАКАЗ', 'КЛИЕНТ', 'ТОВАРЫ', 'СУММА', 'СТАТУС'].map((h, i) => (
        <text key={h} x={[80, 160, 288, 380, 456][i]!} y={106} fill="#475569" fontSize="9" fontFamily="system-ui" fontWeight="600">{h}</text>
      ))}

      {/* Table rows */}
      {statuses.map(({ label, fill, stroke, dot, name, id, total }, i) => (
        <g key={label}>
          <rect x="56" y={116 + i * 60} width="504" height="60" fill={i % 2 === 0 ? '#0f172a' : '#0a1628'} />
          <rect x="56" y={116 + i * 60 + 59} width="504" height="1" fill="#1e293b" />
          {/* Order ID */}
          <text x="80" y={116 + i * 60 + 24} fill="#94a3b8" fontSize="10" fontFamily="system-ui">{id}</text>
          <text x="80" y={116 + i * 60 + 38} fill="#475569" fontSize="9" fontFamily="system-ui">Telegram</text>
          {/* Customer avatar + name */}
          <circle cx="172" cy={116 + i * 60 + 28} r="14" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <text x="172" y={116 + i * 60 + 33} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="system-ui">{['А','Б','В'][i]}</text>
          <rect x="192" y={116 + i * 60 + 20} width="72" height="8" rx="4" fill="#475569" />
          <rect x="192" y={116 + i * 60 + 32} width="48" height="6" rx="3" fill="#334155" />
          {/* Items */}
          <rect x="288" y={116 + i * 60 + 18} width="80" height="8" rx="4" fill="#334155" />
          <rect x="288" y={116 + i * 60 + 30} width="56" height="6" rx="3" fill="#1e293b" />
          {/* Total */}
          <text x="380" y={116 + i * 60 + 28} fill="#e2e8f0" fontSize="11" fontFamily="system-ui" fontWeight="600">{total}</text>
          {/* Status badge */}
          <rect x="430" y={116 + i * 60 + 18} width="110" height="22" rx="7" fill={fill} stroke={stroke} strokeOpacity="0.5" strokeWidth="1" />
          <circle cx="447" cy={116 + i * 60 + 29} r="4" fill={dot} />
          <text x="456" y={116 + i * 60 + 33} fill={dot} fontSize="8.5" fontFamily="system-ui">{label}</text>
        </g>
      ))}

      {/* Pagination */}
      <rect x="56" y="296" width="504" height="44" fill="#111827" />
      <text x="80" y="322" fill="#475569" fontSize="9" fontFamily="system-ui">Показано 3 из 12 заказов</text>
      <rect x="440" y="308" width="28" height="20" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <rect x="476" y="308" width="28" height="20" rx="5" fill="rgba(37,99,235,0.2)" stroke="#3b82f6" strokeOpacity="0.5" strokeWidth="1" />
      <text x="454" y="322" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="system-ui">‹</text>
      <text x="490" y="322" textAnchor="middle" fill="#60a5fa" fontSize="11" fontFamily="system-ui">›</text>
    </svg>
  )
}

/* Legacy exports kept for any residual imports */
export { IllustrMiniApp as IllustrShopPhone, IllustrCatalogWizard as IllustrOneClick, IllustrOrders as IllustrCrm }
