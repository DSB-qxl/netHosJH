import request from '@/utils/request-online'

export function fetchUserList(query) {
  return request({
    url: 'users',
    method: 'get',
    baseURL: '/api',
    params: query
  })
}

export function fetchUser(id) {
  return request({
    url: '/users',
    method: 'get',
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

export function updateUser(data) {
  return request({
    url: '/users',
    method: 'put',
    data
  })
}
