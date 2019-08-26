import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    ip: '@ip()',
    hostname: '@name(true)',
    cpu: /[a-zA-Z][a-z0-9][a-z0-9][0-1][0-9]/,
    memory: /5[0-9][0-9][0-9][0-9]/,
    disk: /5[0-9][0-9][0-9][0-9]/,
    systemversion: /5[0-9][0-9][0-9][0-9]/,
    'datacenter|1': ['DMZ', 'APP', 'Manage', 'Local'],
    'status|1': ['success', 'failed'],
    boxname: /5[0-9][0-9][0-9][0-9]/
  }))
}

export default [
  {
    url: '/service/hostsinfo/get',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20, sort } = config.query
      let mockList = List.filter(item => {
        return true
      })
      if (sort === '-id') {
        mockList = mockList.reverse()
      }
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        status: 0,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/service/hostsinfo/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        status: 0
      }
    }
  },
  {
    url: '/service/hostsinfo/update',
    type: 'post',
    response: config => {
      const data = config.query
      return {
        code: 20000,
        status: 0,
        data: data
      }
    }
  },
  {
    url: '/service/hostsinfo/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        status: 0
      }
    }
  }
]
