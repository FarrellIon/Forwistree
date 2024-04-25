// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-aos'],
  typescript: {
    typeCheck: true,
    strict: true
  },
  app: {
    head: {
      title: 'Forwistree',
      meta: [
        { name: 'description', content: 'Forwistree' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap'},
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap'}
      ]
    }
  },
  runtimeConfig: {
    public:{
      API_HOST: process.env.API_HOST,
    }
  }
})
