import type { CatalogItemDto } from '@cloth-ai/contracts'

export const MOCK_CATALOG: CatalogItemDto[] = [
  {
    id: 'p1',
    title: 'Топ спортивный — черный',
    category: 'tops',
    priceTjs: 199,
    coverUrl:
      'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=60',
    modelImages: {
      tall: 'https://images.unsplash.com/photo-1520975732137-0462f16d0d86?auto=format&fit=crop&w=900&q=60',
      mid: 'https://images.unsplash.com/photo-1520975693413-35e3c3c94762?auto=format&fit=crop&w=900&q=60',
      curvy:
        'https://images.unsplash.com/photo-1520975687797-1b3f2a444ef1?auto=format&fit=crop&w=900&q=60',
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
    coverUrl:
      'https://images.unsplash.com/photo-1520975802649-9fa4b0dff78b?auto=format&fit=crop&w=900&q=60',
    modelImages: {
      tall: 'https://images.unsplash.com/photo-1520975817233-1a6a7c9c3e34?auto=format&fit=crop&w=900&q=60',
      mid: 'https://images.unsplash.com/photo-1520975819999-2b6a7c9c3e34?auto=format&fit=crop&w=900&q=60',
      curvy:
        'https://images.unsplash.com/photo-1520975823333-3b6a7c9c3e34?auto=format&fit=crop&w=900&q=60',
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
    coverUrl:
      'https://images.unsplash.com/photo-1520975829000-4b6a7c9c3e34?auto=format&fit=crop&w=900&q=60',
    modelImages: {
      tall: 'https://images.unsplash.com/photo-1520975833000-5b6a7c9c3e34?auto=format&fit=crop&w=900&q=60',
      mid: 'https://images.unsplash.com/photo-1520975836000-6b6a7c9c3e34?auto=format&fit=crop&w=900&q=60',
      curvy:
        'https://images.unsplash.com/photo-1520975839000-7b6a7c9c3e34?auto=format&fit=crop&w=900&q=60',
    },
    sizes: [
      { size: 'XS', inStock: true },
      { size: 'S', inStock: true },
      { size: 'M', inStock: false },
      { size: 'L', inStock: true },
      { size: 'XL', inStock: true },
    ],
  },
]

