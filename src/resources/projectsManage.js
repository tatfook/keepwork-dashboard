import projectsManageModel from '@/models/projectsManage'
import BaseResource from './base'
import _ from 'lodash'

const model = projectsManageModel()

const privilegeMap = [
  {
    key: 1,
    value: '开启'
  },
  {
    key: 2,
    value: '关闭'
  }
]
const typeMap = [
  {
    key: 0,
    value: '网站项目'
  },
  {
    key: 1,
    value: 'paracraft项目'
  }
]
const projectLevel = [
  {
    key: 0,
    value: '一般'
  },
  {
    key: 1,
    value: '精选项目'
  }
]

export default class ProjectsManage extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        show: false,
        edit: false,
        search: false
      },
      {
        name: 'type',
        type: 'Number',
        show: true,
        search: true,
        options: typeMap,
        filter: (key) => {
          for (const item of typeMap) {
            if (item.key === key) {
              return item.value
            }
          }

          return key
        }
      },
      {
        name: 'choicenessNo',
        type: 'Number',
        options: projectLevel,
        filter: (key) => {
          for (const item of projectLevel) {
            if (item.key === key) {
              return item.value
            }
          }

          return key
        }
      },
      {
        name: 'name',
        type: 'String',
        edit: true,
        search: true
      },
      {
        name: 'projectUrl',
        edit: false,
        sort: false,
        search: false
      },
      {
        name: 'privilege',
        type: 'Number',
        edit: true,
        show: true,
        search: true,
        options: privilegeMap,
        filter: (key) => {
          for (const item of privilegeMap) {
            const privilegeKey = key & 1
            if (privilegeKey !== 1) {
              return '关闭'
            } else {
              return item.value
            }
          }

          return key
        }
      },
      {
        name: 'createdAt',
        type: 'Date',
        show: true,
        edit: false,
        search: false
      },
      {
        name: 'updatedAt',
        type: 'Date',
        show: true,
        edit: false,
        search: false
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['create', 'show', 'edit'],
      extra: [
        {
          name: 'resources.ProjectsManage.setForSelection',
          func: (ctx, data) => {
            data.choicenessNo = 1
            ctx.model.update(data)
          }
        },
        {
          name: 'resources.ProjectsManage.cancelSelect',
          func: (ctx, data) => {
            data.choicenessNo = 0
            ctx.model.update(data)
          }
        }
      ]
    }
  }

  static action() {
    return {
      extra: [
        {
          name: 'resources.ProjectsManage.batchSelection',
          func: (ctx) => {
            _.forEach(ctx.selected, (item, key) => {
              item.choicenessNo = 1
              ctx.model.update(item)
            })
          }
        },
        {
          name: 'resources.ProjectsManage.batchCancellationSelection',
          func: (ctx) => {
            _.forEach(ctx.selected, (item, key) => {
              item.choicenessNo = 0
              ctx.model.update(item)
            })
          }
        }
      ]
    }
  }
}
