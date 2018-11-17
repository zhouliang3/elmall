import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/v1/unit/list',
    method: 'get',
    params: query
  })
}

export function createUnit(data) {
  return request({
    url: '/api/v1/unit/create',
    method: 'post',
    data
  })
}

export function readUnit(data) {
  return request({
    url: '/api/v1/unit/detail',
    method: 'get',
    data
  })
}

export function updateUnit(data) {
  return request({
    url: '/api/v1/unit/update',
    method: 'post',
    data
  })
}

export function deleteUnit(id) {
  return request({
    url: '/api/v1/unit/' + id,
    method: 'delete'
  })
}

export function all() {
  return request({
    url: '/api/v1/unit/all',
    method: 'get'
  })
}
