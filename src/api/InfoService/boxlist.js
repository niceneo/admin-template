import request from '@/utils/request'

export function listdata(query) {
  return request({
    url: '/service/boxs/get',
    method: 'get',
    params: query
  })
}

export function createdata(data) {
  return request({
    url: '/service/boxs/create',
    method: 'post',
    params: data
  })
}

export function updatedata(data) {
  return request({
    url: '/service/boxs/update',
    method: 'post',
    params: data
  })
}

export function deletedata(data) {
  return request({
    url: '/service/boxs/delete',
    method: 'post',
    params: data
  })
}

