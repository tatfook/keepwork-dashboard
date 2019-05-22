import { resourceCRUD } from '@/api/keepwork'
import BaseResource from './base'

const model = resourceCRUD('feedbacks')

const rewriteFunc = {
  list(params) {
    const { username, url, type, state, result } = params.where
    if (JSON.stringify(params.where) === '{}') {
      return model.list({ where: {}})
    }
    let payload = {}
    if (username.$like) {
      payload = { username }
    }
    if (url.$like) {
      payload = { ...payload, url }
    }
    if (type.$in.length) {
      payload = { ...payload, type }
    }
    if (state.$in.length) {
      payload = { ...payload, state }
    }
    if (result.$in.length) {
      payload = { ...payload, result }
    }
    return model.list({ where: payload })
  }
}

export default class Feedback extends BaseResource {
  static attributes() {
    return [
      {
        name: 'createdAt',
        type: 'Date',
        edit: false,
        search: false
      },
      {
        name: 'username',
        type: 'String',
        edit: false,
        search: true
      },
      {
        name: 'url',
        type: 'String',
        edit: false,
        search: true
      },
      {
        name: 'type',
        type: 'Number',
        edit: false,
        filter: value => {
          switch (value) {
            case 0:
              return '其他'
            case 1:
              return '假冒网址'
            case 2:
              return '传播病毒'
            case 3:
              return '反动'
            case 4:
              return '色情'
            case 5:
              return '暴力'
          }
        }
      },
      {
        name: 'description',
        type: 'String',
        edit: false,
        search: true
      },
      {
        name: 'state',
        type: 'Number',
        edit: false,
        search: true,
        filter: value => {
          switch (value) {
            case 0:
              return '未处理'
            case 1:
              return '已处理'
          }
        }
      },
      {
        name: 'result',
        type: 'Number',
        edit: false,
        search: true,
        filter: value => {
          switch (value) {
            case 0:
              return '未处理'
            case 1:
              return '处理'
            case 2:
              return '误报'
            case 3:
              return '重复'
          }
        }
      }
    ]
  }
  static model() {
    return { ...model, ...rewriteFunc }
  }
  static actions() {
    return {
      disabled: ['show', 'edit', 'create', 'delete', 'destroy'],
      extra: [
        {
          name: 'dispose',
          button: 'danger',
          title(row) {
            return '处理'
          },
          async func(row, that) {
            await model.update({ ...row, result: 1, state: 1 })
          }
        },
        {
          name: 'misinformation',
          button: 'danger',
          title(row) {
            return '误报'
          },
          async func(row, that) {
            await model.update({ ...row, result: 2, state: 1 })
          }
        },
        {
          name: 'repetition',
          button: 'danger',
          title(row) {
            return '重复'
          },
          async func(row, that) {
            await model.update({ ...row, result: 3, state: 1 })
          }
        }
      ]
    }
  }
}
