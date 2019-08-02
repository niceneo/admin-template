import Mock from 'mockjs'

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    host: '@ip',
    'status|1': ['RUNNING', 'STOPPED'],
    boxname: /[a-zA-Z][a-z0-9][a-z0-9][a-z0-9][0-9]/,
    display_time: '@datetime',
    'module|1': ['订单业务', '支付业务', '运营业务', '会员业务', '营销业务']
  }]
})

export default [
  {
    url: '/box/info',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
