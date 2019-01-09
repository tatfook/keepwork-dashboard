import projectsManageModel from '@/models/projectsManage'
import BaseResource from './base'

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
        name: 'name',
        type: 'String',
        edit: true,
        search: true
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
            if (item.key === key) {
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
      disabled: ['create', 'show', 'edit']
    }
  }
}
