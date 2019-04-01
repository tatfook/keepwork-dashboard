// import { resourceCRUD } from '@/api/lesson'
import pacakgeModel from '@/models/package'
import { getUserToken } from '@/api/getUserToken'
import BaseResource from './base'
import store from '@/store'

const model = pacakgeModel()
const stateMap = [
  {
    key: 0,
    value: '新创建'
  },
  {
    key: 1,
    value: '审核中'
  },
  {
    key: 2,
    value: '审核通过'
  },
  {
    key: 3,
    value: '审核不通过'
  },
  {
    key: 4,
    value: '下架'
  }
]

const ENV = process.env.NODE_ENV

export default class Package extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        edit: false,
        width: '100px'
      },
      {
        name: 'packageName',
        type: 'String',
        title: true,
        required: true
      },
      {
        name: 'intro',
        type: 'String',
        component: 'text',
        show: false,
        search: false
      },
      {
        name: 'userId',
        type: 'Number',
        required: true,
        show: false,
        edit: false,
        default: () => store.getters.currentUser.id,
        associate: 'User'
      },
      {
        name: 'username',
        type: 'String',
        search: false
      },
      {
        name: 'subjectId',
        type: 'Number',
        required: true,
        associate: 'Subject',
        show: false
      },
      {
        name: 'subjectName',
        type: 'String',
        search: false
      },
      {
        name: 'minAge',
        type: 'Number',
        required: true
      },
      {
        name: 'maxAge',
        type: 'Number',
        required: true
      },
      {
        name: 'state',
        type: 'Number',
        required: true,
        component: 'select',
        options: stateMap,
        filter: value => {
          for (const option of stateMap) {
            if (option.key === value) return option.value
          }
          return value
        }
      },
      {
        name: 'extra.message',
        type: 'String',
        component: 'text',
        search: false
      },
      {
        name: 'rmb',
        type: 'Number',
        required: true
      },
      {
        name: 'coin',
        type: 'Number',
        required: true
      },
      {
        name: 'extra.coverUrl',
        type: 'String',
        show: false,
        search: false
      },
      {
        name: 'createdAt',
        type: 'Date',
        edit: false
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['show'],
      extra: [{
        name: 'view',
        title() {
          return '预览'
        },
        async func(row, that) {
          const { userId, id } = row
          const token = await getUserToken(userId)
          if (token) {
            if (ENV === 'stage' || ENV === 'release') {
              const url = `https://${ENV}.keepwork.com/l/preview/package/${id}?token=${token}`
              return window.open(url, '_blank')
            }
            window.open(`https://keepwork.com/l/preview/package/${id}?token=${token}`, '_blank')
          }
        }
      }]
    }
  }

  static customFilter() {
    return {
      append: {
        state(object) {
          for (const item of stateMap) {
            if (item.value === object.value.trim()) {
              return { ...object, value: item.key }
            }
          }
          return object
        }
      }
    }
  }

  static queryFilter(query) {
    // will include all by default, to make sure every associate works
    query.include({ all: true, nested: true })
    return query
  }
}
