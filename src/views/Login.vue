<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api/auth'
import { userStore } from '../stores/user'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)

// 登录：成功后写入 store 再跳转列表页
async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = '请输入用户名和密码'
    return
  }
  error.value = ''
  submitting.value = true
  try {
    const data = await login({ username: username.value, password: password.value })
    userStore.setLogin(data) // login() 已被拦截器剥壳，data = { token, user }
    router.push('/book-list')
  } catch (e) {
    error.value = '登录失败，请检查账号密码'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">
        <div class="logo">📚</div>
        <h1>图书管理系统</h1>
        <p>欢迎回来，请登录你的账号</p>
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <form @submit.prevent="handleLogin">
        <div class="field">
          <label>用户名</label>
          <input v-model="username" type="text" placeholder="请输入用户名" autocomplete="username" />
        </div>
        <div class="field">
          <label>密码</label>
          <input v-model="password" type="password" placeholder="请输入密码" autocomplete="current-password" />
        </div>
        <button type="submit" class="btn" :disabled="submitting">
          {{ submitting ? '登录中...' : '登 录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 16px;
  padding: 40px 36px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

.brand {
  text-align: center;
  margin-bottom: 28px;
}
.logo {
  font-size: 44px;
  margin-bottom: 8px;
}
.brand h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}
.brand p {
  margin: 6px 0 0;
  color: #999;
  font-size: 14px;
}

.error-msg {
  background: #fdecea;
  color: #d32f2f;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  margin: 0 0 16px;
  text-align: center;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}
.field label {
  font-size: 14px;
  color: #555;
  margin-bottom: 6px;
}
.field input {
  height: 44px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 14px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}
.field input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.btn {
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #667eea, #764ba2);
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}
.btn:hover:not(:disabled) {
  opacity: 0.9;
}
.btn:active:not(:disabled) {
  transform: translateY(1px);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>