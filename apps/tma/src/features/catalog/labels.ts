import type { ModelType } from '@cloth-ai/contracts'

export function modelTypeShortRu(model: ModelType): string {
  switch (model) {
    case 'tall':
      return 'Высокий'
    case 'mid':
      return 'Средний'
    case 'curvy':
      return 'Плотный'
    default:
      return model
  }
}

export function categoryFilterLabelRu(cat: 'all' | 'tops' | 'bottoms' | 'dresses'): string {
  switch (cat) {
    case 'all':
      return 'Все'
    case 'tops':
      return 'Верх'
    case 'bottoms':
      return 'Низ'
    case 'dresses':
      return 'Платья'
    default:
      return cat
  }
}
