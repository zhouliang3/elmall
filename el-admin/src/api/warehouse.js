import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/v1/warehouse/list',
    method: 'get',
    params: query
  })
}

export function createWarehouse(data) {
  return request({
    url: '/api/v1/warehouse/create',
    method: 'post',
    data
  })
}

export function readWarehouse(data) {
  return request({
    url: '/api/v1/warehouse/detail',
    method: 'get',
    data
  })
}

export function updateWarehouse(data) {
  return request({
    url: '/api/v1/warehouse/update',
    method: 'post',
    data
  })
}

export function deleteWarehouse(id) {
  return request({
    url: '/api/v1/warehouse/' + id,
    method: 'delete'
  })
}
