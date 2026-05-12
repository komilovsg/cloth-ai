import type { SVGProps } from 'react'

/**
 * Вешалка под референс: открытый крючок (дуга вверх), короткая шейка,
 * прямые плечи, широкое основание, сильно скруглённые нижние углы.
 * Один непрерывный контур (обводка).
 */
export const HANGER_WIRE_PATH =
  'M17 13 Q24 5 31 13 L24 13 L24 17 L6 33 Q4 35 7 37 H41 Q43 35 41 33 L24 17'

const defaultStroke = 2

type Props = Omit<SVGProps<SVGSVGElement>, 'fill' | 'stroke'> & {
  stroke?: string
  strokeWidth?: number | string
  title?: string
}

export function HangerSymbol({
  title,
  className,
  stroke = 'currentColor',
  strokeWidth = defaultStroke,
  vectorEffect,
  ...rest
}: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 42"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect={vectorEffect}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <path d={HANGER_WIRE_PATH} />
    </svg>
  )
}
