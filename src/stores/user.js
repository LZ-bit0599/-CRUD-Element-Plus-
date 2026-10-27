import { reactive } from 'vue'

// 无 Pinia 依赖的轻量 store 单例，token/user 持久化到 localStorage
export const userStore = reactive({
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user') || 'null'),

  // 登录成功写入
  setLogin({ token, user }) {
    this.token = token
    this.user = user
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  },

  // 退出/登出清理
  clear() {
    this.token = ''
    this.user = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
})