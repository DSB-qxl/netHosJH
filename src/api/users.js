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
export function restPassword(id) {
  return request({
    url: '/password',
    method: 'delete',
    params: { id }
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
