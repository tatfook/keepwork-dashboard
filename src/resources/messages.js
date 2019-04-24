import { resourceCRUD } from '@/api/keepwork'
import BaseResource from './base'
import _ from 'lodash'

const model = resourceCRUD('messages')
const formatMessage = data => {
  const { id, sender = 0, type = 0, all = true, text = '' } = data
  return { id, sender, type, all, msg: { type: 0, text: text }, extra: { senderName: 'Keepwork', senderPortrait: '' }}
}

const _rewrite = {
  async list(params) {
    const res = await model.list(params)
    return {
      count: res.count,
      rows: res.rows.map(item => ({ ...item, ...item.msg }))
    }
  },
  update(data) {
    const _data = formatMessage(data)
    return model.update(_data)
  },
  create(data) {
    const _data = formatMessage(data)
    return model.create(_data)
  }
}

const typesMap = [{
  key: 0,
  value: '系统消息'
}]
export default class Messages extends BaseResource {
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
        name: 'createdAt',
        type: 'Date',
        show: true,
        edit: false,
        search: true
      },
      {
        name: 'sender',
        type: 'Number',
        show: false,
        edit: false,
        search: false
      },
      {
        name: 'text',
        type: 'String',
        component: 'editor',
        edit: true,
        show: true,
        search: false
      },
      {
        name: 'type',
        type: 'Number',
        show: true,
        edit: true,
        options: typesMap,
        component: 'select',
        default: 0,
        search: false,
        filter(value) {
          return _.find(typesMap, item => item.key === value).value || typesMap[0].value
        }
      }
    ]
  }

  static model() {
    return { ...model, ..._rewrite }
  }

  static actions() {
    return {
      disabled: ['show']
    }
  }
}
