import projectsManageModel from '@/models/projectsManage'
import BaseResource from './base'
import { resourceCRUD } from '@/api/keepwork'
import _ from 'lodash'

const projectsCRUD = resourceCRUD('projects')
const systemTagsCRUD = resourceCRUD('systemTags')

const model = projectsManageModel()
const temp = {}
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
        show: true,
        edit: false,
        search: true
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
        show: true,
        search: true
      },
      {
        name: 'classifyTags',
        type: 'String',
        show: true,
        search: true
      },
      {
        name: 'visibility',
        type: 'String',
        show: true,
        search: false,
        filter(value) {
          return value > 0 ? '私有' : '公开'
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
      },
      {
        name: 'choicenessNo',
        type: 'Number',
        show: true,
        search: true,
        filter(value) {
          // FIXME: i18n
          return value > 0 ? '精选' : '一般'
        }
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['create', 'show', 'edit', 'destroy', 'delete'],
      extra: [{
        name: 'set',
        button: 'primary',
        type(row) {
          return row['choicenessNo'] > 0 ? 'danger' : 'success'
        },
        title(row) {
          return row['choicenessNo'] > 0 ? '取消精选' : '设为精选'
        },
        async func(row, that) {
          const flag = row['choicenessNo'] === 0 ? 1 : 0
          await projectsCRUD.update({ ...row, choicenessNo: flag })
        }
      }, {
        name: 'viewDetail',
        title() {
          return '查看详情'
        },
        func(project) {
          window.open(`https://keepwork.com/pbl/project/${project.id}`, '_blank')
        }
      }]
    }
  }

  static customFilter() {
    return {
      append: {
        choicenessNo(object) {
          if (object.value === '精选') {
            return {
              ...object,
              op: 'gt',
              value: 0
            }
          }

          if (object.value === '一般') {
            return {
              ...object,
              op: 'eq',
              value: 0
            }
          }
          return object
        }
      }
    }
  }

  static buttons() {
    return {
      append: [
        {
          name: '设置精选',
          type: 'primary',
          async func(projects) {
            await Promise.all(projects.map(item => projectsCRUD.update({ ...item, choicenessNo: 1 })))
          }
        },
        {
          name: '取消精选',
          type: 'danger',
          async func(projects) {
            await Promise.all(projects.map(item => projectsCRUD.update({ ...item, choicenessNo: 0 })))
          }
        },
        {
          name: '设置系统标签',
          type: 'primary',
          refresh: false,
          async func(projects, that) {
            const res = await systemTagsCRUD.list()
            const tags = _.map(_.get(res, 'rows', []), item => item.tagname)
            that.checkboxData = tags
            that.dialogCheckboxVisible = true
            temp['projects'] = projects
            temp['tags'] = tags
            that.dialogCheckboxStatus = 'addSystemTags'
          }
        },
        {
          name: '取消系统标签',
          type: 'danger',
          refresh: false,
          async func(projects, that) {
            const projectTags = _.uniq(_.reduce(projects, (arr, cur) => {
              const _tags = _.filter(_.split(_.get(cur, 'classifyTags', ''), '|'), v => v)
              return [...arr, ..._tags]
            }, []))
            that.checkboxData = projectTags
            that.dialogCheckboxVisible = true
            temp['projects'] = projects
            temp['tags'] = projectTags
            that.dialogCheckboxStatus = 'removeSystemTags'
          }
        }
      ],
      callback: {
        async addSystemTags(selectedTags, that) {
          const { projects } = temp
          await Promise.all(projects.map(item => {
            const { classifyTags } = item
            const currentTags = classifyTags.split('|')
            const finalTags = _.uniq([...currentTags, ...selectedTags]).join('|')
            return projectsCRUD.update({ ...item, classifyTags: finalTags })
          }))
        },
        async removeSystemTags(selectedTags, that) {
          const { projects } = temp
          const filterProjects = _.filter(projects, p => p.classifyTags)
          await Promise.all(filterProjects.map(item => {
            const { classifyTags } = item
            const currentTags = classifyTags.split('|')
            const finalTags = _.filter(currentTags, tag => tag && !selectedTags.includes(tag)).join('|')
            return projectsCRUD.update({ ...item, classifyTags: finalTags })
          }))
        }
      }
    }
  }
}
