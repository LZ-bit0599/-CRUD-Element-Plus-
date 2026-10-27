<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)   // 侧边栏折叠

function logout() {
  userStore.clear()
  router.push('/login')
}
</script>

<template>
  <el-container class="layout">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
      <div class="logo">
        <span v-if="!isCollapse">📚 图书管理系统</span>
        <span v-else>📚</span>
      </div>

      <el-menu
        :default-active="route.path"
        :collapse="isCollapse"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
      >
        <el-menu-item index="/dashboard">
          <el-icon><span>📊</span></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/book-list">
          <el-icon><span>📖</span></el-icon>
          <span>图书管理</span>
        </el-menu-item>
        <el-menu-item index="/borrow-records">
          <el-icon><span>📋</span></el-icon>
          <span>借阅记录</span>
        </el-menu-item>
        <el-menu-item index="/borrow-calendar">
          <el-icon><span>📅</span></el-icon>
          <span>借阅日历</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧主体 -->
    <el-container>
      <!-- 顶栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-button
            text
            @click="isCollapse = !isCollapse"
            style="font-size:20px"
          >
            {{ isCollapse ? '☰' : '✕' }}
          </el-button>
        </div>
        <div class="header-right">
          <!-- 通知 Badge -->
          <el-badge :value="3" class="badge">
            <el-button text style="font-size:18px">🔔</el-button>
          </el-badge>

          <!-- 用户下拉菜单 -->
          <el-dropdown trigger="click">
            <span class="user-info">
              <el-avatar :size="32" style="background:#409eff">
                {{ (userStore.user?.username || '管')[0] }}
              </el-avatar>
              <span class="username">{{ userStore.user?.username || '管理员' }}</span>
              <span style="font-size:12px;color:#999">▾</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人设置</el-dropdown-item>
                <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区 -->
      <el-main class="main">
        <router-view />
        <!-- 回到顶部 -->
        <el-backtop target=".main" :right="40" :bottom="40" />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout { height: 100vh; }

.aside {
  background: #304156;
  overflow: hidden;
  transition: width 0.3s;
}
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  border-bottom: 1px solid #3a4f65;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 20px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.badge { margin-right: 4px; }
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.username { font-size: 14px; color: #333; }

.main {
  background: #f0f2f5;
  overflow-y: auto;
  min-height: 0;
}
</style>