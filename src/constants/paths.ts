const paths = {
  home: '/',
  community: '/community',
  message: '/message',
  notification: '/notification',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password/:token',
  profile: '/users/:id',
  postEditor: '/posts',
  postDetails: '/posts/:id',
  groupDetails: '/groups/:id'
} as const

export default paths
