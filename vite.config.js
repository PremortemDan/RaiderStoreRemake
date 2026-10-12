import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// En desarrollo (npm run dev) Vite no ejecuta la carpeta /api como lo hace Vercel.
// Este plugin sirve /api/chat localmente con el mismo código, leyendo DEEPSEEK_API_KEY de .env.
function localApi(env) {
  return {
    name: 'local-api-chat',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        process.env.DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY || ''

        let raw = ''
        for await (const chunk of req) raw += chunk
        try {
          req.body = raw ? JSON.parse(raw) : {}
        } catch {
          req.body = {}
        }

        res.status = (code) => {
          res.statusCode = code
          return res
        }
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        }

        const { default: handler } = await server.ssrLoadModule('/api/chat.js')
        await handler(req, res)
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), localApi(env)],
    server: {
      host: '0.0.0.0',
      port: 5173
    }
  }
})
