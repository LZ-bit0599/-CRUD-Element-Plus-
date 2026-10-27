<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBooks, addBook, updateBook, deleteBook } from '../api/book'
import MyPagination from '../components/MyPagination.vue'

const formRef = ref(null)

const rules = {
  title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
}

const list = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({ id: null, title: '', author: '', rating: 0, available: true, stock: 1 })
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const keyword = ref('')

// 详情抽屉
const drawerVisible = ref(false)
const drawerRow = ref(null)

const dialogTitle = () => isEdit.value ? '编辑图书' : '新增图书'

async function fetchBooks() {
  loading.value = true
  try {
    const { list: l, total: t } = await getBooks({ page: page.value, pageSize: pageSize.value, keyword: keyword.value })
    list.value = l
    total.value = t
  } finally { loading.value = false }
}

function onSearch() { page.value = 1; fetchBooks() }

function openAdd() {
  isEdit.value = false
  form.value = { id: null, title: '', author: '', rating: 0, available: true, stock: 1 }
  formRef.value?.resetFields()
  dialogVisible.value = true
}

function openEdit(row) {
  isEdit.value = true
  form.value = { id: row.id, title: row.title, author: row.author, rating: row.rating || 0, available: row.available ?? true, stock: row.stock || 1 }
  formRef.value?.resetFields()
  dialogVisible.value = true
}

function openDetail(row) {
  drawerRow.value = { ...row }
  drawerVisible.value = true
}

async function submit() {
  await formRef.value.validate()
  isEdit.value ? await updateBook(form.value.id, form.value) : await addBook(form.value)
  dialogVisible.value = false
  fetchBooks()
}

function remove(row) {
  ElMessageBox.confirm(`确定删除《${row.title}》吗？`, '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning',
  }).then(async () => {
    await deleteBook(row.id)
    ElMessage.success('删除成功')
    fetchBooks()
  }).catch(() => {})
}

onMounted(fetchBooks)
</script>

<template>
  <div>
    <!-- 顶栏：搜索 + 新增 -->
    <div class="page-head">
      <h2>📖 图书列表</h2>
      <div class="head-right">
        <el-input
          v-model="keyword"
          placeholder="搜索书名 / 作者"
          clearable
          style="width: 240px"
          @keyup.enter="onSearch"
          @clear="onSearch"
        >
          <template #prefix><span>🔍</span></template>
        </el-input>
        <el-button type="primary" @click="openAdd">+ 新增图书</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" stripe style="width:100%">
      <template #empty><el-empty description="暂无数据" /></template>
      <el-table-column type="index" label="#" width="50" />
      <el-table-column prop="title" label="书名" min-width="180" />
      <el-table-column prop="author" label="作者" min-width="120" />
      <el-table-column label="评分" width="140">
        <template #default="{ row }">
          <el-rate v-model="row.rating" disabled show-score style="height:24px" />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.available ? 'success' : 'info'" size="small">
            {{ row.available ? '可借' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" width="70" align="center" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openDetail(row)">详情</el-button>
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <MyPagination
      v-if="total > 0"
      v-model:page="page"
      v-model:page-size="pageSize"
      :total="total"
      @change="fetchBooks"
    />

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle()" width="520px" destroy-on-close :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item prop="title" label="书名">
          <el-input v-model="form.title" placeholder="请输入书名" />
        </el-form-item>
        <el-form-item prop="author" label="作者">
          <el-input v-model="form.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="评分">
          <el-rate v-model="form.rating" :max="5" show-score />
        </el-form-item>
        <el-form-item label="可借状态">
          <el-switch v-model="form.available" active-text="可借" inactive-text="下架" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="form.stock" :min="0" :max="999" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 详情抽屉 -->
    <el-drawer v-model="drawerVisible" title="图书详情" size="420px">
      <template v-if="drawerRow">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="书名">{{ drawerRow.title }}</el-descriptions-item>
          <el-descriptions-item label="作者">{{ drawerRow.author }}</el-descriptions-item>
          <el-descriptions-item label="评分">
            <el-rate v-model="drawerRow.rating" disabled show-score />
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="drawerRow.available ? 'success' : 'info'">
              {{ drawerRow.available ? '可借' : '下架' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="库存">{{ drawerRow.stock }}</el-descriptions-item>
          <el-descriptions-item label="价格">¥{{ drawerRow.price }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped>
.page-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
.head-right { display: flex; gap: 12px; }
</style>