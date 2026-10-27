<script setup>
import { onMounted, ref } from 'vue'
import { getBooks } from '../api/book'
import { getBorrows } from '../api/borrow'

// 统计数据
const bookTotal = ref(0)
const availableCount = ref(0)
const borrowTotal = ref(0)
const overdueCount = ref(0)
const recentBooks = ref([])

// 统计百分比
const availablePercent = ref(0)

async function loadStats() {
  const { list: books } = await getBooks({ page: 1, pageSize: 100, keyword: '' })
  bookTotal.value = books.length
  availableCount.value = books.filter((b) => b.available).length
  availablePercent.value = bookTotal.value ? Math.round((availableCount.value / bookTotal.value) * 100) : 0
  recentBooks.value = books.slice(-5).reverse()

  const { list: borrows } = await getBorrows({ page: 1, pageSize: 100, keyword: '' })
  borrowTotal.value = borrows.length
  overdueCount.value = borrows.filter((b) => b.status === '逾期').length
}

onMounted(loadStats)
</script>

<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover">
          <el-statistic title="图书总量" :value="bookTotal">
            <template #prefix>📚</template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover">
          <el-statistic title="可借数量" :value="availableCount">
            <template #prefix>✅</template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover">
          <el-statistic title="借阅总数" :value="borrowTotal">
            <template #prefix>📋</template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover">
          <el-statistic title="逾期数量" :value="overdueCount">
            <template #prefix>⚠️</template>
            <template #suffix>
              <span style="font-size:14px;color:#f56c6c">本</span>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- 可借率进度条 + 最新入库 -->
    <el-row :gutter="20" style="margin-top:20px">
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover">
          <template #header>
            <span>📊 可借率</span>
          </template>
          <el-progress
            :percentage="availablePercent"
            :color="availablePercent > 60 ? '#67c23a' : availablePercent > 30 ? '#e6a23c' : '#f56c6c'"
            :stroke-width="20"
          />
          <p style="margin-top:10px;color:#999">
            {{ availableCount }} / {{ bookTotal }} 本可借
          </p>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card shadow="hover">
          <template #header>
            <span>🆕 最新入库</span>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="book in recentBooks"
              :key="book.id"
              :timestamp="book.author"
              placement="top"
            >
              {{ book.title }}
              <el-tag :type="book.available ? 'success' : 'info'" size="small" style="margin-left:8px">
                {{ book.available ? '可借' : '下架' }}
              </el-tag>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.dashboard { padding: 0; }
</style>