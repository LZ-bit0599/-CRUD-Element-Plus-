<script setup>
import { onMounted, ref } from 'vue'
import { getBorrows } from '../api/borrow'
import MyPagination from '../components/MyPagination.vue'

const list = ref([])
const loading = ref(false)
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const keyword = ref('')

// 统计数据
const borrowingCount = ref(0)
const overdueCount = ref(0)

const statusType = (s) =>
  s === '借阅中' ? 'primary' : s === '已归还' ? 'success' : 'danger'

async function fetchBorrows() {
  loading.value = true
  try {
    const { list: l, total: t } = await getBorrows({ page: page.value, pageSize: pageSize.value, keyword: keyword.value })
    list.value = l
    total.value = t
    // 计算统计
    borrowingCount.value = l.filter((b) => b.status === '借阅中').length
    overdueCount.value = l.filter((b) => b.status === '逾期').length
  } finally { loading.value = false }
}

function onSearch() { page.value = 1; fetchBorrows() }

onMounted(fetchBorrows)
</script>

<template>
  <div>
    <!-- 页头 -->
    <div class="page-head">
      <h2>📋 借阅记录</h2>
      <el-input
        v-model="keyword"
        placeholder="搜索书名 / 借阅人"
        clearable
        style="width: 240px"
        @keyup.enter="onSearch"
        @clear="onSearch"
      />
    </div>

    <!-- 统计小卡片 -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="6">
        <el-card shadow="hover" body-style="padding:16px;text-align:center">
          <div style="font-size:28px;font-weight:700;color:#409eff">{{ total }}</div>
          <div style="color:#999">总记录</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" body-style="padding:16px;text-align:center">
          <div style="font-size:28px;font-weight:700;color:#67c23a">{{ borrowingCount }}</div>
          <div style="color:#999">借阅中</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" body-style="padding:16px;text-align:center">
          <div style="font-size:28px;font-weight:700;color:#f56c6c">{{ overdueCount }}</div>
          <div style="color:#999">逾期</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" stripe>
      <template #empty><el-empty description="暂无借阅记录" /></template>
      <el-table-column type="index" label="#" width="50" />
      <el-table-column prop="bookTitle" label="书名" min-width="200" />
      <el-table-column prop="borrower" label="借阅人" width="120" />
      <el-table-column prop="borrowDate" label="借阅日期" width="130" />
      <el-table-column prop="returnDate" label="归还日期" width="130" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <MyPagination
      v-if="total > 0"
      v-model:page="page"
      v-model:page-size="pageSize"
      :total="total"
      @change="fetchBorrows"
    />
  </div>
</template>

<style scoped>
.page-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
</style>