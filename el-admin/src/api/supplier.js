import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/v1/supplier/list',
    method: 'get',
    params: query
  })
}

export function createSupplier(data) {
  return request({
    url: '/api/v1/supplier/create',
    method: 'post',
    data
  })
}

export function readSupplier(data) {
  return request({
    url: '/api/v1/supplier/detail',
    method: 'get',
    data
  })
}

export function updateSupplier(data) {
  return request({
    url: '/api/v1/supplier/update',
    method: 'post',
    data
  })
}

export function deleteSupplier(id) {
  return request({
    url: '/api/v1/supplier/' + id,
    method: 'delete'
  })
}
