const paths = {
  home: '/',
  community: '/community',
  message: '/message',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password/:token',
  profile: '/users/:id',
  postEditor: '/posts',
  postDetails: '/posts/:id',
  groupDetails: '/groups/:id',
  search: '/search'
} as const

export default paths
