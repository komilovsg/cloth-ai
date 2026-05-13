import type { CatalogItemDto } from '@cloth-ai/contracts'

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=720&h=960&fit=crop&q=80`

/** Fashion-specific clothing images for demo mode. */
export const MOCK_CATALOG: CatalogItemDto[] = [
  {
    id: 'p1',
    title: 'Топ спортивный — черный',
    category: 'tops',
    priceTjs: 199,
    coverUrl: U('1571019613454-1cb2f99b2d8b'),
    modelImages: {
      tall: U('1571019613454-1cb2f99b2d8b'),
      mid: U('1552902865-b72c031ac5ea'),
      curvy: U('1576566588028-4147f3842f27'),
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
    coverUrl: U('1558618666-fcd25c85cd64'),
    modelImages: {
      tall: U('1558618666-fcd25c85cd64'),
      mid: U('1542272604-787c3835535d'),
      curvy: U('1506629082359-be9e19d5aabc'),
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
    coverUrl: U('1539109136881-3be0616acf4b'),
    modelImages: {
      tall: U('1539109136881-3be0616acf4b'),
      mid: U('1515886657613-9f3515b0c78f'),
      curvy: U('1490481651871-ab68de25d43d'),
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
    coverUrl: U('1556821840-3a63f15732ce'),
    modelImages: {
      tall: U('1556821840-3a63f15732ce'),
      mid: U('1509631179647-0177331693ae'),
      curvy: U('1544441893-675173e5d5f8'),
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
    coverUrl: U('1542272604-787c3835535d'),
    modelImages: {
      tall: U('1542272604-787c3835535d'),
      mid: U('1558618666-fcd25c85cd64'),
      curvy: U('1541099649105-4b4b8e6a8a48'),
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
    coverUrl: U('1611117775350-ac3950990985'),
    modelImages: {
      tall: U('1611117775350-ac3950990985'),
      mid: U('1585487000160-6e568bde7786'),
      curvy: U('1596755095775-29c9f0e5e5de'),
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
