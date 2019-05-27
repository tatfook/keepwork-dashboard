import { resourceCRUD } from '@/api/keepwork'
import BaseResource from './base'
import _ from 'lodash'
import store from '@/store'
import { broadcast, msg } from '@/api/broadcast'
import createService from '@/utils/request'

const request = createService()
async function bulkMessages(data) {
  return request({
    method: 'post',
    url: `/admins/userMessages/bulk`,
    data
  })
}

const model = resourceCRUD('messages')
const userCRUD = resourceCRUD('users')
const formatMessage = data => {
  const { sender = 0, type = 0, text = '', username = [] } = data
  const all = username.length > 0 ? 0 : 1
  return { sender, type, all, msg: { type: 0, text: text }, extra: { senderName: 'Keepwork', senderPortrait: '', operator: store.getters.name }}
}

const _rewrite = {
  async list(params) {
    const defaultOrder = ['createdAt', 'desc']
    if (params.order.length === 0) {
      params.order.push(defaultOrder)
    }
    const res = await model.list(params)
    return {
      count: res.count,
      rows: res.rows.map(item => ({ ...item, ...item.msg }))
    }
  },
  async create(data) {
    const userIds = data.username
    const _data = formatMessage(data)
    if (_data.all) {
      await model.create(_data)
      broadcast({ data: _data })
    } else {
      const userList = await userCRUD.list({ where: { id: { $in: userIds }}})
      const usernameList = _.map(_.get(userList, 'rows', []), item => item.username)
      _data['extra']['receivers'] = usernameList
      _data['extra']['receiverIDs'] = userIds
      const msgInfo = await model.create(_data)
      const messageList = _.map(userIds, userId => {
        const { id, ...reset } = msgInfo
        return {
          userId,
          messageId: id,
          ...reset
        }
      })
      await bulkMessages({ resourceName: 'userMessages', datas: messageList })
      msgInfo.extra = {}
      msg({ userIds, msg: msgInfo })
    }
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
        name: 'username',
        type: 'Array',
        component: 'messageUserSelect',
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
        name: 'all',
        type: 'Number',
        edit: false,
        search: false,
        filter(value) {
          return value === 1 ? '广播' : '指定用户'
        }
      },
      {
        name: 'extra.receivers',
        type: 'String',
        edit: false,
        search: false,
        filter(receivers) {
          if (_.isArray(receivers)) {
            return receivers.join(',')
          }
          return '所有人'
        }
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
