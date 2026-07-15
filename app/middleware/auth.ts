export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie<string | null>('auth_token')

  if (to.path === '/admin/login') {
    if (token.value) {
      return navigateTo('/admin/dashboard')
    }
    return 
  }

  if (to.path.startsWith('/admin') && !token.value) {
    return navigateTo('/admin/login')
  }
})