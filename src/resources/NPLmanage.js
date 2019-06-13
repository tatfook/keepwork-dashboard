import { resourceCRUD } from '@/api/keepwork'
import BaseResource from './base'
import NPLmanage from '@/models/NPLmanage'
import _ from 'lodash'

const model = _.merge({}, resourceCRUD('games'), NPLmanage)

const stateMap = [
  {
    key: 0,
    value: '未开始'
  },
  {
    key: 1,
    value: '进行中'
  },
  {
    key: 2,
    value: '已结束'
  }
]

export default class NPLManage extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        edit: false,
        width: '100px'
      },
      {
        name: 'name',
        type: 'String',
        edit: true,
        required: true
      },
      {
        name: 'no',
        type: 'Number',
        required: true
      },
      {
        name: 'startDate',
        type: 'Date',
        edit: true,
        required: true,
        search: false,
        component: 'time'
      },
      {
        name: 'endDate',
        type: 'Date',
        edit: true,
        required: true,
        search: false,
        component: 'time'
      },
      {
        name: 'extra.description',
        type: 'String',
        search: false,
        edit: true
      },
      {
        name: 'state',
        type: 'Number',
        edit: false,
        required: true,
        component: 'select',
        options: stateMap,
        filter: value => {
          for (const option of stateMap) {
            if (option.key === value) return option.value
          }
          return value
        }
      }
    ]
  }
  static model() {
    return model
  }
  static actions() {
    return {
      disabled: ['show', 'delete']
    }
  }
}
