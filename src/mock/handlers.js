import { http, HttpResponse } from 'msw'

// 内存中的数据源（模拟数据库）
let books = [
  { id: 1, title: 'JavaScript 高级程序设计', author: 'Nicholas C. Zakas', price: 99, rating: 4.5, available: true, stock: 12 },
  { id: 2, title: 'CSS 权威指南', author: 'Eric A. Meyer', price: 79, rating: 4, available: false, stock: 3 },
  { id: 3, title: '深入浅出 Vue.js', author: '刘博文', price: 69, rating: 4.5, available: true, stock: 8 },
  { id: 4, title: 'React 设计原理', author: '卡颂', price: 89, rating: 4, available: true, stock: 15 },
  { id: 5, title: 'TypeScript 编程', author: 'Boris Cherny', price: 59, rating: 4, available: true, stock: 6 },
  { id: 6, title: 'Node.js 实战', author: 'Mike Cantelon', price: 75, rating: 3.5, available: false, stock: 0 },
  { id: 7, title: '算法导论', author: 'CLRS', price: 128, rating: 5, available: true, stock: 4 },
  { id: 8, title: '图解 HTTP', author: '上野宣', price: 49, rating: 4.5, available: true, stock: 20 },
  { id: 9, title: '数据结构与算法分析', author: 'Mark Weiss', price: 69, rating: 3.5, available: true, stock: 7 },
  { id: 10, title: '编程珠玑', author: 'Jon Bentley', price: 45, rating: 4, available: false, stock: 2 },
  { id: 11, title: '代码整洁之道', author: 'Robert C. Martin', price: 59, rating: 4.5, available: true, stock: 10 },
  { id: 12, title: '重构：改善既有代码的设计', author: 'Martin Fowler', price: 79, rating: 4.5, available: true, stock: 5 },
  { id: 13, title: '你不知道的 JavaScript（上）', author: 'Kyle Simpson', price: 39, rating: 4, available: true, stock: 11 },
  { id: 14, title: 'Webpack 实战', author: '居玉皓', price: 59, rating: 3.5, available: true, stock: 9 },
  { id: 15, title: 'Git 权威指南', author: '蒋鑫', price: 89, rating: 4, available: false, stock: 3 },
]
let nextId = 16 // 自增主键

// 借阅记录数据
const borrows = [
  { id: 1, bookTitle: 'JavaScript 高级程序设计', borrower: '张三', borrowDate: '2026-10-01', returnDate: '2026-10-15', status: '借阅中' },
  { id: 2, bookTitle: 'CSS 权威指南', borrower: '李四', borrowDate: '2026-10-20', returnDate: '2026-10-27', status: '借阅中' },
  { id: 3, bookTitle: 'Vue.js 设计与实现', borrower: '王五', borrowDate: '2026-09-10', returnDate: '2026-10-28', status: '逾期' },
  { id: 4, bookTitle: 'Node.js 实战', borrower: '赵六', borrowDate: '2026-10-22', returnDate: '2026-10-29', status: '借阅中' },
  { id: 5, bookTitle: '算法导论', borrower: '孙七', borrowDate: '2026-10-25', returnDate: '2026-11-02', status: '借阅中' },
  { id: 6, bookTitle: '网络是怎样连接的', borrower: '赵六', borrowDate: '2026-10-26', returnDate: '2026-10-27', status: '借阅中' },
  { id: 7, bookTitle: '深入浅出 Vue.js', borrower: '张三', borrowDate: '2026-09-15', returnDate: '2026-10-08', status: '已归还' },
  { id: 8, bookTitle: 'React 设计原理', borrower: '李四', borrowDate: '2026-10-26', returnDate: '2026-11-05', status: '借阅中' },
  { id: 9, bookTitle: 'TypeScript 编程', borrower: '王五', borrowDate: '2026-10-18', returnDate: '2026-10-25', status: '已归还' },
  { id: 10, bookTitle: '图解 HTTP', borrower: '孙七', borrowDate: '2026-10-10', returnDate: '2026-10-24', status: '已归还' },
  { id: 11, bookTitle: '代码整洁之道', borrower: '张三', borrowDate: '2026-10-27', returnDate: '2026-11-10', status: '借阅中' },
  { id: 12, bookTitle: '重构：改善既有代码的设计', borrower: '赵六', borrowDate: '2026-09-20', returnDate: '2026-10-05', status: '逾期' },
  { id: 13, bookTitle: '编程珠玑', borrower: '李四', borrowDate: '2026-10-15', returnDate: '2026-10-29', status: '借阅中' },
  { id: 14, bookTitle: '你不知道的 JavaScript（上）', borrower: '王五', borrowDate: '2026-10-26', returnDate: '2026-11-03', status: '借阅中' },
  { id: 15, bookTitle: '数据结构与算法分析', borrower: '孙七', borrowDate: '2026-09-28', returnDate: '2026-10-12', status: '已归还' },
]

/**
 * GET /api/borrows（分页+搜索借阅记录）
 */
const getBooks = http.get('/api/books', ({ request }) => {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') || 1)
  const pageSize = Number(url.searchParams.get('pageSize') || 10)
  const keyword = url.searchParams.get('keyword') || ''

  // keyword 过滤（模糊匹配书名/作者）
  let filtered = books
  if (keyword) {
    filtered = books.filter(
      (b) => b.title.includes(keyword) || b.author.includes(keyword)
    )
  }

  const total = filtered.length
  const list = filtered.slice((page - 1) * pageSize, page * pageSize)
  return HttpResponse.json({ code: 200, data: { list, total, page, pageSize } })
})

/** POST /api/books 新增图书 */
const createBook = http.post('/api/books', async ({ request }) => {
  const data = await request.json()
  const book = { id: nextId++, ...data }
  books.push(book)
  return HttpResponse.json({ code: 200, data: book })
})

/** PUT /api/books/:id 编辑图书 */
const updateBook = http.put('/api/books/:id', async ({ params, request }) => {
  const id = Number(params.id)
  const data = await request.json()
  books = books.map((b) => (b.id === id ? { ...b, ...data } : b))
  return HttpResponse.json({ code: 200, data: books.find((b) => b.id === id) })
})

/** DELETE /api/books/:id 删除图书 */
const deleteBook = http.delete('/api/books/:id', ({ params }) => {
  const id = Number(params.id)
  books = books.filter((b) => b.id !== id)
  return HttpResponse.json({ code: 200, data: { success: true } })
})

/** POST /api/login 登录，返回 token 和用户信息 */
const login = http.post('/api/login', async ({ request }) => {
  const { username } = await request.json()
  return HttpResponse.json({
    code: 200,
    data: {
      token: `mock-token-${Date.now()}`,
      user: { id: 1, username, role: 'admin' },
    },
  })
})

/** 需要 Authorization 头，否则返回 401（配合响应拦截器） */
const protectedBook = http.get('/api/books/:id/secret', ({ request }) => {
  const auth = request.headers.get('Authorization')
  if (!auth) {
    return HttpResponse.json({ code: 401, message: '未登录' }, { status: 200 })
  }
  return HttpResponse.json({ code: 200, data: { secret: books.find((b) => b.id === Number(request.params.id)) } })
})

/** 恒返回 HTTP 500，触发响应拦截器的 500 提示 */
const serverError = http.get('/api/error', () => {
  return new HttpResponse(null, { status: 500 })
})

/** GET /api/borrows/all 返回全部借阅记录（供日历使用） */
const getBorrowsAll = http.get('/api/borrows/all', () => {
  return HttpResponse.json({ code: 200, data: borrows })
})

/** GET /api/borrows 借阅记录（分页+搜索） */
const getBorrows = http.get('/api/borrows', ({ request }) => {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') || 1)
  const pageSize = Number(url.searchParams.get('pageSize') || 10)
  const keyword = url.searchParams.get('keyword') || ''

  let filtered = borrows
  if (keyword) {
    filtered = borrows.filter(
      (b) => b.bookTitle.includes(keyword) || b.borrower.includes(keyword)
    )
  }
  const total = filtered.length
  const list = filtered.slice((page - 1) * pageSize, page * pageSize)
  return HttpResponse.json({ code: 200, data: { list, total, page, pageSize } })
})

// 导出所有 handlers 供 setupWorker/setupServer 使用
export const handlers = [login, getBooks, createBook, updateBook, deleteBook, protectedBook, serverError, getBorrows, getBorrowsAll]