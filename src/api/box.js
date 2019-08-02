import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/box/info',
    method: 'get',
    params
  })
}
