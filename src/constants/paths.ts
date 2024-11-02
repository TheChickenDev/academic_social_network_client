const paths = {
  home: '/',
  community: '/community',
  message: '/message',
  notification: '/notification',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password/:token',
  profile: '/profile',
  postEditor: '/posts',
  postDetails: '/posts/:id'
} as const

export default paths
