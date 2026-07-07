// src/api/admin.js
import client from './client'

const USE_MOCK = !import.meta.env.VITE_API_URL

export const getAdminStats = () =>
  USE_MOCK
    ? Promise.resolve({
        data: {
          data: {
            total_users: 4820,
            total_products: 12350,
            total_reports: 28,
            total_sales: 8940,
          }
        }
      })
    : client.get('/admin/stats')

export const getAdminReports = () =>
  USE_MOCK ? Promise.resolve({ data: { data: [] } }) : client.get('/admin/reports')

export const updateReportStatus = (id, status) =>
  USE_MOCK ? Promise.resolve({ data: { data: { id, status } } }) : client.patch(`/admin/reports/${id}`, { status })

export const updateUserStatus = (id, status) =>
  USE_MOCK ? Promise.resolve({ data: { data: { id, status } } }) : client.patch(`/admin/users/${id}/status`, { status })
