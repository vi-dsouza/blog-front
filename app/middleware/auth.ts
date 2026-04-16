export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie<string | null>('auth_token')

  // 1. Evita que o middleware rode em loop infinito ao tentar acessar o login
  if (to.path === '/admin/login') {
    if (token.value) {
      return navigateTo('/admin/dashboard')
    }
    return // Se não tem token e quer ir pro login, permite o acesso.
  }

  // 2. Protege apenas as rotas que começam com /admin
  if (to.path.startsWith('/admin') && !token.value) {
    return navigateTo('/admin/login')
  }
})