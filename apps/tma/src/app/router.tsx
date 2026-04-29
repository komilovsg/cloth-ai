import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './root-layout'
import { ErrorPage } from './error-page'
import { CatalogPage } from '../pages/catalog/catalog-page'
import { ProductPage } from '../pages/product/product-page'
import { CartPage } from '../pages/cart/cart-page'
import { CheckoutPage } from '../pages/checkout/checkout-page'
import { OrderPage } from '../pages/order/order-page'
import { OnboardingAvatarPage } from '../pages/onboarding/onboarding-avatar-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: 'product/:productId', element: <ProductPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'order/:orderId', element: <OrderPage /> },
      { path: 'onboarding/avatar', element: <OnboardingAvatarPage /> },
    ],
  },
])

