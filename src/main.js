import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { handlers } from './mock/handlers'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 仅开发环境启动 MSW worker，生产环境不拦截真实请求
async function enableMocking() {
  if (!import.meta.env.DEV) return
  const { setupWorker } = await import('msw/browser')
  const worker = setupWorker(...handlers)
  await worker.start({
    onUnhandledRequest: 'bypass', // 未匹配的请求直接放行
  })
  console.info('[MSW] mock worker 已在开发环境启动')
}

enableMocking().then(() => {
  createApp(App).use(ElementPlus).use(router).mount('#app')
})