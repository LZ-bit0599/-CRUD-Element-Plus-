import request from '../utils/request'

// 分页+搜索获取图书列表
export const getBooks = ({ page, pageSize, keyword }) =>
  request.get('/books', { params: { page, pageSize, keyword } })

// 新增图书
export const addBook = (data) => request.post('/books', data)

// 编辑图书
export const updateBook = (id, data) => request.put(`/books/${id}`, data)

// 删除图书
export const deleteBook = (id) => request.delete(`/books/${id}`)