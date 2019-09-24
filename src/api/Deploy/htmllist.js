import request from '@/utils/request'

export function htmllist(query) {
  return request({
    url: '/release/htmlorders/get',
    method: 'get'
    // params: query
  })
}

export function GetProjectTypes(query) {
  return request({
    url: '/release/htmllists/get',
    method: 'get'
  })
}

export function htmlcreate(query) {
  return request({
    url: '/release/htmlorders/add',
    method: 'get',
    params: query
  })
}
