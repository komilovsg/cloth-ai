import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './root-layout'
import { RequireAdminAuth } from './auth-gate'
import { OrdersPage } from '../pages/orders/orders-page'
import { OrderDetailsPage } from '../pages/orders/order-details-page'
import { CatalogPage } from '../pages/catalog/catalog-page'
import { OverviewPage } from '../pages/overview/overview-page'
import { CatalogWizardPage } from '../pages/catalog/catalog-wizard-page'
import { LoginPage } from '../pages/login/login-page'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
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
    ],
  },
])

