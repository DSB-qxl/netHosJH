import Mock from 'mockjs'

const List = []
const count = 300

//const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
//const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let j = 0; j < count; j++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    account: '@first',
    password: '@first',
    name: Mock.Random.cname(),
    certificate_no: Mock.Random.id(),
    mobile: /^[1][3][0-9]-[0-9]{4}-[0-9]{4}$/,
    user_type: '@integer(1, 3)',
    'status|1': ['published', 'draft', 'deleted'],
    platforms: ['a-platform']
  }))
}

export default [
  {
    url: '/mock-users',
    type: 'get',
    response: config => {
      const { user_type, name, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        //if (importance && item.importance !== +importance) return false
        //if (user_type && item.user_type !== user_type) return false
        //if (name && item.name.indexOf(name) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

//   {
//     url: '/users?id=*',
//     type: 'get',
//     response: config => {
//       const { id } = config.query
//       for (const users of List) {
//         if (users.id === +id) {
//           return {
//             code: 20000,
//             data: users
//           }
//         }
//       }
//     }
//   },

//   {
//     url: '/users',
//     type: 'post',
//     response: _ => {
//       return {
//         code: 20000,
//         data: 'success'
//       }
//     }
//   },

//   {
//     url: '/users',
//     type: 'put',
//     response: _ => {
//       return {
//         code: 20000,
//         data: 'success'
//       }
//     }
//   }
]

