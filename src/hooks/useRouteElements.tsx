/* eslint-disable react-refresh/only-export-components */
import ForgotPassword from '@/pages/ForgotPassword'
import Login from '@/pages/Login'
import Profile from '@/pages/Profile'
import Register from '@/pages/Register'
import ResetPassword from '@/pages/ResetPassword'
import { useContext } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import DefaultLayout from '@/components/DefaultLayout'
import paths from '@/constants/paths'
import { AppContext } from '@/contexts/app.context'

const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={paths.login} />
}

const RejectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Navigate to={paths.home} /> : <Outlet />
}

const routes: RouteObject[] = [
  {
    path: paths.home,
    element: (
      <DefaultLayout>
        <div>Home</div>
      </DefaultLayout>
    ),
    index: true
  },
  {
    path: '',
    element: <RejectedRoute />,
    children: [
      {
        path: paths.login,
        element: <Login />
      },
      {
        path: paths.register,
        element: <Register />
      },
      {
        path: paths.forgotPassword,
        element: <ForgotPassword />
      },
      {
        path: paths.resetPassword,
        element: <ResetPassword />
      }
    ]
  },
  {
    path: '',
    element: <ProtectedRoute />,
    children: [
      {
        path: paths.profile,
        element: (
          <DefaultLayout>
            <Profile />
          </DefaultLayout>
        )
      }
    ]
  }
]

const useRouteElements = () => useRoutes(routes)
export default useRouteElements
