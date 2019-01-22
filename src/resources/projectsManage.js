import projectsManageModel from '@/models/projectsManage'
import BaseResource from './base'
import { resourceCRUD } from '@/api/keepwork'
import _ from 'lodash'

const projectsCRUD = resourceCRUD('projects')

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
      disabled: ['create', 'show', 'edit']
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

  static customActions() {
    return {
      append: [
        {
          name: 'setChoice',
          button: 'primary',
          filter: row => row['choicenessNo'] === 0,
          async func(row, that) {
            await projectsCRUD.update({ ...row, choicenessNo: 1 })
              .then(res => {
                row['choicenessNo'] = 1
                that.$notify({
                  title: that.$t('success'),
                  message: that.$t('base.success.update'),
                  type: 'success',
                  duration: 2000
                })
              }).catch(e => {
                that.$notify({
                  title: that.$t('fail'),
                  message: that.$t('base.failed.update'),
                  type: 'error',
                  duration: 2000
                })
              })
          }
        },
        {
          name: 'setDefault',
          button: 'danger',
          filter: row => row['choicenessNo'] > 0,
          async func(row, that) {
            await projectsCRUD.update({ ...row, choicenessNo: 0 })
              .then(res => {
                row['choicenessNo'] = 0
                that.$notify({
                  title: that.$t('success'),
                  message: that.$t('base.success.update'),
                  type: 'success',
                  duration: 2000
                })
              })
              .catch(e => {
                that.$notify({
                  title: that.$t('fail'),
                  message: that.$t('base.failed.update'),
                  type: 'error',
                  duration: 2000
                })
              })
          }
        },
        {
          name: 'viewDetail',
          func(project) {
            window.open(`https://keepwork.com/pbl/project/${project.id}`, '_blank')
          }
        }
      ]
    }
  }
}
