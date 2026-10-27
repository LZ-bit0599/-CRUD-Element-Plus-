import request from '../utils/request'

// 分页+搜索获取借阅记录
export const getBorrows = ({ page, pageSize, keyword }) =>
  request.get('/borrows', { params: { page, pageSize, keyword } })

// 获取全部借阅记录（供日历使用）
export const getBorrowsAll = () => request.get('/borrows/all')