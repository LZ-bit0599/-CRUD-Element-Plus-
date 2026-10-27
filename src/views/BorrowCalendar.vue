<script setup>
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getBorrowsAll } from '../api/borrow'

const loading = ref(false)
const v = ref(new Date())        // el-calendar 绑定的当前月份
const allBorrows = ref([])       // 全部借阅记录

// 按 returnDate 分组 { '2026-10-27': [...] }
const dateMap = computed(() => {
  const map = {}
  allBorrows.value.forEach((b) => {
    if (b.returnDate) {
      ;(map[b.returnDate] ||= []).push(b)
    }
  })
  return map
})

// 当天到期图书列表
function dueBooks(day) {
  const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
  return dateMap.value[key] || []
}

// 加载全部数据
async function fetchAll() {
  loading.value = true
  try {
    allBorrows.value = await getBorrowsAll()
  } finally {
    loading.value = false
  }
}

onMounted(fetchAll)
</script>

<template>
  <div class="page">
    <h2 class="title">📅 借阅日历</h2>
    <p class="sub">悬停日期查看当天到期图书</p>

    <el-calendar v-loading="loading" v-model="v">
      <!-- 自定义日期格子 -->
      <template #date-cell="{ data }">
        <el-tooltip
          v-if="dueBooks(data.date).length"
          placement="top"
          :show-after="200"
        >
          <!-- tooltip 内容：当天到期列表 -->
          <template #content>
            <div v-for="b in dueBooks(data.date)" :key="b.id" style="margin:4px 0">
              📖 {{ b.bookTitle }}
              <span style="color:#999">（{{ b.borrower }}）</span>
            </div>
          </template>

          <!-- 日期格子：橙色圆点标记 -->
          <div class="has-due">
            <span>{{ data.day.split('-')[2] }}</span>
            <span class="dot">{{ dueBooks(data.date).length }}</span>
          </div>
        </el-tooltip>

        <!-- 无到期：普通日期 -->
        <span v-else>{{ data.day.split('-')[2] }}</span>
      </template>
    </el-calendar>
  </div>
</template>

<style scoped>
.title { margin: 0 0 4px; color: #333; }
.sub {
  margin: 0 0 24px;
  color: #999;
  font-size: 14px;
}

.has-due {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #e6a23c;
  font-weight: 600;
}
.dot {
  font-size: 10px;
  color: #e6a23c;
  line-height: 1;
}
</style>