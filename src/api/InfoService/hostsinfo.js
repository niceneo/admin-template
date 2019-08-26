import request from '@/utils/request'

export function listdata(query) {
  return request({
    url: '/service/hostsinfo/get',
    method: 'get',
    params: query
  })
}

export function createdata(data) {
  return request({
    url: '/service/hostsinfo/create',
    method: 'post',
    params: data
  })
}

export function updatedata(data) {
  return request({
    url: '/service/hostsinfo/update',
    method: 'post',
    params: data
  })
}

export function deletedata(data) {
  return request({
    url: '/service/hostsinfo/delete',
    method: 'post',
    params: data
  })
}

