import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    ip: '@ip()',
    desc: '@name(true)',
    boxname: /[a-zA-Z][a-z0-9][a-z0-9][0-1][0-9]/,
    dubbo: /5[0-9][0-9][0-9][0-9]/,
    jetty: /5[0-9][0-9][0-9][0-9]/,
    jmx: /5[0-9][0-9][0-9][0-9]/,
    health: /5[0-9][0-9][0-9][0-9]/
  }))
}

export default [
  {
    url: '/service/boxs/get',
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
    url: '/service/boxs/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        status: 0
      }
    }
  },
  {
    url: '/service/boxs/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        status: 0
      }
    }
  },
  {
    url: '/service/boxs/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        status: 0
      }
    }
  }
]
