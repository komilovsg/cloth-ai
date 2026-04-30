import type { CatalogItemDto } from '@cloth-ai/contracts'

/** Mirrors backend seed URLs (picsum) for mock API mode — stable CDN images. */
export const MOCK_CATALOG: CatalogItemDto[] = [
  {
    id: 'p1',
    title: 'Топ спортивный — черный',
    category: 'tops',
    priceTjs: 199,
    coverUrl: 'https://picsum.photos/id/428/720/960',
    modelImages: {
      tall: 'https://picsum.photos/id/428/720/960',
      mid: 'https://picsum.photos/id/429/720/960',
      curvy: 'https://picsum.photos/id/431/720/960',
    },
    sizes: [
      { size: 'XS', inStock: false },
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: true },
      { size: 'XL', inStock: false },
    ],
  },
  {
    id: 'p2',
    title: 'Легинсы — графит',
    category: 'bottoms',
    priceTjs: 249,
    coverUrl: 'https://picsum.photos/id/338/720/960',
    modelImages: {
      tall: 'https://picsum.photos/id/338/720/960',
      mid: 'https://picsum.photos/id/339/720/960',
      curvy: 'https://picsum.photos/id/342/720/960',
    },
    sizes: [
      { size: 'XS', inStock: true },
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: false },
      { size: 'XL', inStock: false },
    ],
  },
  {
    id: 'p3',
    title: 'Платье — синее',
    category: 'dresses',
    priceTjs: 399,
    coverUrl: 'https://picsum.photos/id/325/720/960',
    modelImages: {
      tall: 'https://picsum.photos/id/325/720/960',
      mid: 'https://picsum.photos/id/326/720/960',
      curvy: 'https://picsum.photos/id/328/720/960',
    },
    sizes: [
      { size: 'XS', inStock: true },
      { size: 'S', inStock: true },
      { size: 'M', inStock: false },
      { size: 'L', inStock: true },
      { size: 'XL', inStock: true },
    ],
  },
  {
    id: 'p4',
    title: 'Худи оверсайз — серый меланж',
    category: 'tops',
    priceTjs: 279,
    coverUrl: 'https://picsum.photos/id/631/720/960',
    modelImages: {
      tall: 'https://picsum.photos/id/631/720/960',
      mid: 'https://picsum.photos/id/668/720/960',
      curvy: 'https://picsum.photos/id/669/720/960',
    },
    sizes: [
      { size: 'XS', inStock: true },
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: true },
      { size: 'XL', inStock: false },
    ],
  },
  {
    id: 'p5',
    title: 'Джинсы прямые — индиго',
    category: 'bottoms',
    priceTjs: 329,
    coverUrl: 'https://picsum.photos/id/535/720/960',
    modelImages: {
      tall: 'https://picsum.photos/id/535/720/960',
      mid: 'https://picsum.photos/id/536/720/960',
      curvy: 'https://picsum.photos/id/538/720/960',
    },
    sizes: [
      { size: 'XS', inStock: false },
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: true },
      { size: 'XL', inStock: true },
    ],
  },
  {
    id: 'p6',
    title: 'Кардиган трикотажный — беж',
    category: 'dresses',
    priceTjs: 359,
    coverUrl: 'https://picsum.photos/id/821/720/960',
    modelImages: {
      tall: 'https://picsum.photos/id/821/720/960',
      mid: 'https://picsum.photos/id/821/720/960',
      curvy: 'https://picsum.photos/id/821/720/960',
    },
    sizes: [
      { size: 'XS', inStock: true },
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: false },
      { size: 'XL', inStock: true },
    ],
  },
]
