import axios from 'axios'

// 创建 axios 实例，统一 baseURL 与超时
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器：从 user store 读取 token 注入请求头
request.interceptors.request.use(
  (config) => {
    // 示例：从 Pinia/Vuex 等 store 取 token
    // const token = useUserStore().token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器：按业务 code 统一处理
request.interceptors.response.use(
  (response) => {
    const { code, data } = response.data
    // 业务成功：剥离 data 直接返回
    if (code === 200) {
      return data
    }
    // token 失效：清空登录态并跳转登录页
    if (code === 401) {
      localStorage.removeItem('token')
      if (location.pathname !== '/login') {
        location.href = '/login'
      }
    }
    return Promise.reject(response.data)
  },
  (error) => {
    // HTTP 层面错误：500 统一提示服务器错误
    if (error.response && error.response.status === 500) {
      console.error('服务器错误，请稍后重试')
    }
    return Promise.reject(error)
  },
)

export default request