.
├── .idea/                     # IDE configs (auto)
├── .nuxt/                     # Built Nuxt code (auto, ignored)
├── node_modules/              # Dependencies (auto)
├── app/
│   ├── plugins/               # Plugins that run before app mounting
│   ├── layouts/               # Application layouts (default.vue, admin.vue, etc.)
│   ├── middleware/            # Route middleware (auth, admin-check, etc.)
│   ├── components/            # Reusable components
│   ├── pages/                 # All pages become routes automatically
│   ├── composables/           # Reusable logic (like Spring services)
│   ├── utils/                 # Helpers (formatters, validators)
│   ├── services/              # API clients (Axios/fetch wrappers)
│   ├── assets/                # SCSS, static images (processed by Vite)
│   ├── public/                # Static files served as-is
│   └── app.vue                # Root component
│
├── server/                    # Nitro server routes (like mini backend)
│   ├── api/                   # Server API endpoints
│   ├── middleware/            # Server-side middleware
│   └── utils/                 # Server utilities
│
├── nuxt.config.ts             # Nuxt configuration
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TS config
└── README.md
