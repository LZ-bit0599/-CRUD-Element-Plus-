import request from '../utils/request'

// 登录，返回 token 和用户信息
export const login = (data) => request.post('/login', data)