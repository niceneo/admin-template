import request from '@/utils/request'

export function listdata(query) {
  return request({
    url: '/service/ipports/get',
    method: 'get',
    params: query
  })
}

// export function fetchArticle(id) {
//   return request({
//     url: '/article/detail',
//     method: 'get',
//     params: { id }
//   })
// }

// export function fetchPv(pv) {
//   return request({
//     url: '/article/pv',
//     method: 'get',
//     params: { pv }
//   })
// }

export function createdata(data) {
  return request({
    url: '/service/ipports/create',
    method: 'post',
    data
  })
}

export function updatedata(data) {
  return request({
    url: '/service/ipports/update',
    method: 'post',
    data
  })
}

export function deletedata(data) {
  return request({
    url: '/service/ipports/delete',
    method: 'post',
    data
  })
}
