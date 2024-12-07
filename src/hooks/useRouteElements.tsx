/* eslint-disable react-refresh/only-export-components */
import ForgotPassword from '@/pages/ForgotPassword'
import Login from '@/pages/Login'
import MyAccount from '@/pages/MyAccount'
import Register from '@/pages/Register'
import ResetPassword from '@/pages/ResetPassword'
import { useContext } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import DefaultLayout from '@/components/DefaultLayout'
import paths from '@/constants/paths'
import { AppContext } from '@/contexts/app.context'
import Home from '@/pages/Home'
import Message from '@/pages/Message'
import Community from '@/pages/Community'
import PostEditor from '@/pages/PostEditor'
import PostDetails from '@/pages/PostDetails/PostDetails'
import GroupDetails from '@/pages/GroupDetails'
import Search from '@/pages/Search'
import NotFoundError from '@/pages/Errors/NotFound'
import AdminDashboard from '@/pages/AdminDashboard'
import Notifications from '@/components/Notifications'

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
        <Home />
      </DefaultLayout>
    ),
    index: true
  },
  {
    path: paths.postDetails,
    element: (
      <DefaultLayout>
        <PostDetails />
      </DefaultLayout>
    )
  },
  {
    path: paths.groupDetails,
    element: (
      <DefaultLayout>
        <GroupDetails />
      </DefaultLayout>
    )
  },
  {
    path: paths.profile,
    element: (
      <DefaultLayout>
        <MyAccount />
      </DefaultLayout>
    )
  },
  {
    path: paths.admin,
    element: <AdminDashboard />
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
        path: paths.message,
        element: (
          <DefaultLayout>
            <Message />
          </DefaultLayout>
        )
      },
      {
        path: paths.community,
        element: (
          <DefaultLayout>
            <Community />
          </DefaultLayout>
        )
      },
      {
        path: paths.postEditor,
        element: (
          <DefaultLayout>
            <PostEditor />
          </DefaultLayout>
        )
      },
      {
        path: paths.search,
        element: (
          <DefaultLayout>
            <Search />
          </DefaultLayout>
        )
      },
      {
        path: paths.notifications,
        element: (
          <DefaultLayout>
            <Notifications />
          </DefaultLayout>
        )
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundError />
  }
]

const useRouteElements = () => useRoutes(routes)
export default useRouteElements
