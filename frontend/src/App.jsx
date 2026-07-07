import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'

// Pages publiques
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import StaticPage from './pages/StaticPage.jsx'

// Pages protégées
import PublishProductPage from './pages/PublishProductPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

// Pages admin
import AdminDashboardPage from './pages/admin/DashboardPage.jsx'
import AdminUsersPage from './pages/admin/UsersPage.jsx'
import AdminProductsPage from './pages/admin/ProductsPage.jsx'
import AdminCategoriesPage from './pages/admin/CategoriesPage.jsx'
import AdminPagesPage from './pages/admin/PagesPage.jsx'
import AdminReportsPage from './pages/admin/ReportsPage.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Site public */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/search" element={<CategoryPage />} />
          <Route path="/page/:slug" element={<StaticPage />} />
          <Route path="/publish" element={<ProtectedRoute><PublishProductPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/pages" element={<AdminPagesPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
