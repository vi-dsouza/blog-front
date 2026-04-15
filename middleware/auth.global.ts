export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie<string | null>('auth_token')

  if (!token.value) {
    return navigateTo('/admin/login')
  }

  // protege tudo dentro de /admin
  if (to.path.startsWith('/admin') && !token.value) {
    return navigateTo('/admin/login')
  }

  // evita acessar login estando logado
  if (to.path === '/admin/login' && token.value) {
    return navigateTo('/admin/dashboard')
  }
})