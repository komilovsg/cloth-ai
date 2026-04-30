import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './root-layout'
import { RequireAdminAuth } from './auth-gate'
import { OrdersPage } from '../pages/orders/orders-page'
import { OrderDetailsPage } from '../pages/orders/order-details-page'
import { CatalogPage } from '../pages/catalog/catalog-page'
import { OverviewPage } from '../pages/overview/overview-page'
import { CatalogWizardPage } from '../pages/catalog/catalog-wizard-page'
import { LoginPage } from '../pages/login/login-page'
import { ShopProfilePage } from '../pages/shop/shop-profile-page'
import { ForgotPasswordPage } from '../pages/auth/forgot-password-page'
import { ResetPasswordPage } from '../pages/auth/reset-password-page'
import { SellersPage } from '../pages/sellers/sellers-page'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  {
    path: '/',
    element: (
      <RequireAdminAuth>
        <RootLayout />
      </RequireAdminAuth>
    ),
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:orderId', element: <OrderDetailsPage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'catalog/new', element: <CatalogWizardPage /> },
      { path: 'catalog/:itemId/edit', element: <CatalogWizardPage /> },
      { path: 'shop', element: <ShopProfilePage /> },
      { path: 'sellers', element: <SellersPage /> },
    ],
  },
])

