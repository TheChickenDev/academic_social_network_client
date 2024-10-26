const paths = {
  home: '/',
  community: '/community',
  message: '/message',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password/:token',
  profile: '/profile',
  post: '/post'
} as const

export default paths
