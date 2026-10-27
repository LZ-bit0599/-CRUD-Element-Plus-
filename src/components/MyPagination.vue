<script setup>
// 通用分页组件：v-model:page + v-model:pageSize 双向绑定
defineProps({
  total: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
})
const emit = defineEmits(['update:page', 'update:pageSize', 'change'])

// 页码 / 每页条数变化 → 双向绑定 + 通知父组件刷新
function onPageChange(p) { emit('update:page', p); emit('change') }
function onSizeChange(s) { emit('update:pageSize', s); emit('change') }
</script>

<template>
  <el-pagination
    :current-page="page"
    :page-size="pageSize"
    :page-sizes="[5, 10, 20, 50]"
    :total="total"
    layout="total, sizes, prev, pager, next"
    background
    @current-change="onPageChange"
    @size-change="onSizeChange"
  />
</template>

<style scoped>
.el-pagination {
  margin-top: 20px;
  justify-content: center;
}
</style>