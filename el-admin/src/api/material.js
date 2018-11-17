import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/api/v1/material/list',
    method: 'post',
    data
  })
}

export function createMaterial(data) {
  return request({
    url: '/api/v1/material/create',
    method: 'post',
    data
  })
}

export function readMaterial(data) {
  return request({
    url: '/api/v1/material/detail',
    method: 'get',
    data
  })
}

export function updateMaterial(data) {
  return request({
    url: '/api/v1/material/update',
    method: 'post',
    data
  })
}

export function deleteMaterial(id) {
  return request({
    url: '/api/v1/material/' + id,
    method: 'delete'
  })
}
