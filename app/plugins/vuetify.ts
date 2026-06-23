import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: 'entreIdeiasTheme',
      themes: {
        entreIdeiasTheme: {
          dark: true, 
          colors: {
            background: '#05050A',
            // background: '#1F1A1B',
            surface: '#0D1321',
            primary: '#EAA851',
            secondary: '#694BB3',
            tertiary: '#FFE5A3',
            quaternary: '#C3732A',
            quinary: '#1F1A1B',
            senary: '#2F2F38',
            septenary: '#D2C4B1',
            branco: '#ffffff',
            error: '#A4262A',
          },
        },
      },
    }
  })

  nuxtApp.vueApp.use(vuetify)
})