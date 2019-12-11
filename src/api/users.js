import request from '@/utils/request-online'

export function fetchUserList(query) {
  return request({
    url: '/users',
    method: 'get',
    baseURL: '/api',
    params: query
  })
}
//重置密码
export function resetPassword(id) {
  return request({
    url: `/users/password/${id}`,
    method: 'delete',
    baseURL: '/api'
  })
}

export function createUser(data) {
  return request({
    url: '/users',
    method: 'post',
    baseURL: '/api',
    data
  })
}

export function updateUser(id, data) {
  return request({
    url: `/users/${id}`,
    method: 'put',
    baseURL: '/api',
    data
  })
}
