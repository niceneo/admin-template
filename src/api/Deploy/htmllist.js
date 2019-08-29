import request from '@/utils/request'

export function htmllist(query) {
  return request({
    url: '/release/htmlorders/get',
    method: 'get',
    params: query
  })
}

export function htmlcreate(query) {
  return request({
    url: '/release/htmlorders/add',
    method: 'get',
    params: query
  })
}
