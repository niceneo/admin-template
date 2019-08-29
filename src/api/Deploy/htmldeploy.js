import request from '@/utils/request'

export function htmldeploydetail(query) {
  const hid = query.hid
  return request({
    url: '/release/htmlorders/' + hid + '/get',
    methods: 'get',
    params: query
  })
}
