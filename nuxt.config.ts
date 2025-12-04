// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',

    /**
     * Enable Nuxt DevTools (only in dev mode)
     */
    devtools: { enabled: true },

    routeRules: {
        '/': { redirect: '/login' }
    },

    /**
     * Global CSS
     */
    css: [
        '~/assets/styles.css'
    ],

    /**
     * Runtime Config (environment variables)
     * You will use this to call your Spring Boot backend
     */
    runtimeConfig: {
        public: {
            apiBase: 'http://localhost:8080',
            appName: 'Translator Studio'
        }
    },

    /**
     * Modules typically used in dashboards
     */
    modules: [
        '@nuxtjs/i18n',
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt'
    ],

    i18n: {
        strategy: 'no_prefix',
        defaultLocale: 'uz',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root',
        },
        locales: [
            { code: 'uz', name: 'O\'zbek', file: 'uz.json' },
            { code: 'en', name: 'English', file: 'en.json' },
            // { code: 'ru', name: 'Русский', file: 'ru.json' }
        ],
        langDir: 'locales', // We will create this folder next
    },

    /**
     * Router settings
     */
    app: {
        head: {
            title: 'Studio Tarjimon',
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' }
            ],
            link: [
                { rel: 'icon', type: 'image/png', href: '/favicon.ico' }
            ]
        }
    },

    /**
     * Typescript strict mode
     */
    typescript: {
        strict: true
    }
})
