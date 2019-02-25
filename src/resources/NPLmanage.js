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
        require: true
      },
      {
        name: 'no',
        type: 'Number'
      },
      {
        name: 'startDate',
        type: 'Date',
        edit: true,
        require: true,
        search: false,
        component: 'time'
      },
      {
        name: 'endDate',
        type: 'Date',
        edit: true,
        require: true,
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
        require: true,
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
