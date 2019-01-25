import choiceProjectsModel from '@/models/choiceProjects'
import BaseResource from './base'
// import { resourceCRUD } from '@/api/keepwork'
import _ from 'lodash'

// const projectsCRUD = resourceCRUD('projects')

const choiceProjectsCRUD = choiceProjectsModel()
// const cache = {}
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

export default class ChoiceProjects extends BaseResource {
  static attributes() {
    return [
      {
        name: 'number',
        type: 'number',
        show: true,
        edit: false,
        search: false
      },
      {
        name: 'choicenessNo',
        type: 'Number',
        show: true,
        edit: false,
        search: false
      },
      {
        name: 'id',
        type: 'Number',
        show: true,
        edit: false,
        search: true
      },
      {
        name: 'name',
        type: 'String',
        edit: false,
        search: true
      },
      {
        name: 'type',
        type: 'Number',
        show: true,
        search: false,
        edit: false,
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
        name: 'privilege',
        type: 'Number',
        edit: false,
        show: false,
        search: false,
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
        name: 'userId',
        type: 'Number',
        edit: false,
        show: false,
        search: false
      },
      {
        name: 'username',
        type: 'String',
        edit: false,
        show: false,
        search: false
      },
      {
        name: 'createdAt',
        type: 'Date',
        show: false,
        edit: false,
        search: false
      },
      {
        name: 'updatedAt',
        type: 'Date',
        show: false,
        edit: false,
        search: false
      },
      {
        name: 'visibility',
        type: 'String',
        show: true,
        edit: false,
        search: false,
        filter(value) {
          return value > 0 ? '私有' : '公开'
        }
      },
      {
        name: 'classifyTags',
        type: 'String',
        show: false,
        edit: false,
        search: false
      }
    ]
  }

  static model() {
    return choiceProjectsCRUD
  }

  static actions() {
    return {
      disabled: ['create', 'show', 'edit', 'destroy', 'delete'],
      extra: [
        {
          name: 'set',
          button: 'danger',
          title(row) {
            return '取消首页精选'
          },
          async func(row, that) {
            await choiceProjectsCRUD.update({ ...row, choicenessNo: 1 })
          }
        },
        {
          name: 'viewDetail',
          title() {
            return '查看详情'
          },
          func(project) {
            window.open(`https://keepwork.com/pbl/project/${project.id}`, '_blank')
          }
        }
      ]
    }
  }

  static buttons() {
    return {
      append: [
        {
          name: '添加首页精选',
          type: 'primary',
          refresh: false,
          checkSelected: false,
          async func(projects, that) {
            const params = {
              data: [
                {
                  label: '项目ID',
                  key: 'projectId',
                  value: ''
                }
              ],
              type: 'input',
              title: '添加首页精选',
              status: 'addHomeChoiceProject'
            }
            that.showDialog(params)
          }
        }
      ],
      callback: {
        async addHomeChoiceProject(inputArr, that) {
          const projectId = _.get(_.find(inputArr, (item) => item.key === 'projectId'), 'value', '')
          if (projectId) {
            const [currentChoiceProjects, project] = await Promise.all([
              choiceProjectsCRUD.list({ where: {}}),
              choiceProjectsCRUD.get(projectId)
            ])
            console.warn(currentChoiceProjects)
            console.log(project)
            await choiceProjectsCRUD.update({ ...project, choicenessNo: 104 })
          }
        }
      }
    }
  }
}
