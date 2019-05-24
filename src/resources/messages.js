import { resourceCRUD } from '@/api/keepwork'
import BaseResource from './base'
import _ from 'lodash'
// import broadcast from '@/api/broadcast'

const model = resourceCRUD('messages')
// const formatMessage = data => {
//   const { id, sender = 0, type = 0, all = 1, text = '' } = data
//   return { id, sender, type, all, msg: { type: 0, text: text }, extra: { senderName: 'Keepwork', senderPortrait: '' }}
// }

const _rewrite = {
  async list(params) {
    const res = await model.list(params)
    return {
      count: res.count,
      rows: res.rows.map(item => ({ ...item, ...item.msg }))
    }
  },
  async create(data) {
    console.log(data)
    // const _data = formatMessage(data)
    // await model.create(_data)
    // broadcast({ data: _data })
    return
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
      // {
      //   name: 'sender',
      //   type: 'Number',
      //   show: false,
      //   edit: false,
      //   search: false
      // },
      {
        name: 'username',
        type: 'Array',
        component: 'username',
        show: false,
        edit: true,
        search: false
      },
      {
        name: 'text',
        type: 'String',
        component: 'editor',
        required: true,
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
      disabled: ['show', 'destroy', 'delete', 'edit', 'export']
    }
  }
}
