import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    hid: '@increment',
    'types|1': ['zuche', 'zuche-m'],
    ps: '@name()',
    'status|1': ['stopped', 'started', 'rollbacked', 'finished'],
    'is_full|1': ['0', '1'],
    related: '@name()',
    user: '@name()',
    created_at: '@datetime()',
    op_user: '@name()',
    operated_at: '@datetime()'
  }))
}

export default [
  {
    url: '/release/htmlorders/get',
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
  }
]
