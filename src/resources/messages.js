import { resourceCRUD } from '@/api/keepwork'
import { resourceCRUD as orgCRUD } from '@/api/lesson'
import BaseResource from './base'
import _ from 'lodash'
import store from '@/store'
import { broadcast, msg } from '@/api/broadcast'
import createService from '@/utils/request'

const request = createService(process.env.LESSON_API)
async function bulkMessages(data) {
  return request({
    method: 'post',
    url: `/admins/userMessage/bulk`,
    data
  })
}

const model = orgCRUD('message')
const userCRUD = resourceCRUD('users')
const formatMessage = data => {
  const { sender = 0, type = 0, username = [] } = data
  const all = username.length > 0 ? 0 : 1
  return { sender, type, all, msg: { type: 0, text: data['msg.text'] }, extra: { senderName: 'Keepwork', senderPortrait: '', operator: store.getters.name }}
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
      rows: res.rows
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
          msgId: id,
          ...reset
        }
      })
      await bulkMessages({ resourceName: 'userMessage', datas: messageList })
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
        name: 'msg.text',
        type: 'String',
        component: 'editor',
        isNested: true,
        edit: true,
        show: true,
        search: false,
        default: ''
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
        isNested: true,
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
          const item = _.find(typesMap, item => item.key === value)
          return _.get(item, 'value', typesMap[0].value)
        }
      },
      {
        name: 'extra.operator',
        type: 'String',
        isNested: true,
        edit: false,
        search: false
      }
    ]
  }

  static model() {
    return { ...model, ..._rewrite }
  }

  static actions() {
    return {
      disabled: ['destroy', 'delete', 'edit', 'export']
    }
  }

  static queryFilter(query) {
    // will include all by default, to make sure every associate works
    query.distinct(true)
    return query
  }
}
