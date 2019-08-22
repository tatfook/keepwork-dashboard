import { resourceCRUD } from '@/api/keepwork'
import BaseResource from './base'
import _ from 'lodash'
import store from '@/store'

const model = resourceCRUD('paracraftVisitors')

const _rewrite = {
  list(params) {
    if (params.order.length === 0) {
      params.order.push(['createdAt', 'desc'])
    }
    return model.list(params)
  },
  update(data) {
    return model.update({
      ...data,
      handler: store.getters.currentUser.id,
      extra: { ...data.extra, handler: store.getters.name }
    })
  }
}
const stateMap = [
  {
    key: 0,
    value: '待处理'
  },
  {
    key: 1,
    value: '忽略'
  },
  {
    key: 2,
    value: '待沟通'
  },
  {
    key: 3,
    value: '交流中'
  },
  {
    key: 4,
    value: '已有意向'
  },
  {
    key: 5,
    value: '价格沟通中'
  },
  {
    key: 6,
    value: '完毕'
  }
]
export default class ParacraftVisitors extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        show: true,
        edit: false,
        search: true
      },
      {
        name: 'realname',
        type: 'String',
        edit: false,
        search: true
      },
      {
        name: 'cellphone',
        type: 'Number',
        show: true,
        edit: false,
        search: true
      },
      {
        name: 'email',
        type: 'String',
        edit: false,
        search: true
      },
      {
        name: 'organization',
        type: 'String',
        edit: false,
        search: true
      },
      {
        name: 'description',
        type: 'String',
        edit: false,
        search: true
      },
      {
        name: 'extra.city',
        type: 'String',
        edit: false,
        filter(city) {
          return _.isArray(city) ? city.join(',') : city
        }
      },
      {
        name: 'extra.scale',
        modelName: 'scale',
        isNested: true,
        type: 'String',
        edit: true
      },
      {
        name: 'createdAt',
        type: 'Date',
        edit: false,
        search: true
      },
      {
        name: 'state',
        type: 'String',
        component: 'select',
        options: stateMap,
        filter(value) {
          return _.find(stateMap, item => item.key === value).value || stateMap[0].value
        }
      },
      {
        name: 'remark',
        component: 'text',
        type: 'String'
      },
      {
        name: 'handler',
        type: 'String',
        edit: false,
        search: false,
        show: false
      },
      {
        name: 'extra.handler',
        type: 'String',
        edit: false,
        search: false
      }
    ]
  }

  static model() {
    return { ...model, ..._rewrite }
  }

  static customFilter() {
    return {
      append: {
        state(object) {
          if (_.isNumber(object.value)) {
            return object
          }
          if (_.isString(object.value)) {
            const key = _.find(stateMap, item => item.value === object.value).key || 0
            return {
              ...object,
              value: key
            }
          }
          return object
        }
      }
    }
  }

  static actions() {
    return {
      disabled: ['show', 'delete', 'create', 'destroy']
    }
  }
}
