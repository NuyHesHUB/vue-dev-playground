import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import process from 'process'


export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [vue()],
    define: {
      'process.env': env
    }
  }
})