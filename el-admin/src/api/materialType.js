import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/v1/materialType/list',
    method: 'get',
    params: query
  })
}

export function createMaterialType(data) {
  return request({
    url: '/api/v1/materialType/create',
    method: 'post',
    data
  })
}

export function readMaterialType(data) {
  return request({
    url: '/api/v1/materialType/detail',
    method: 'get',
    data
  })
}

export function updateMaterialType(data) {
  return request({
    url: '/api/v1/materialType/update',
    method: 'post',
    data
  })
}

export function deleteMaterialType(id) {
  return request({
    url: '/api/v1/materialType/' + id,
    method: 'delete'
  })
}

export function all() {
  return request({
    url: '/api/v1/materialType/all',
    method: 'get'
  })
}
