import BaseResource from './base'
import teacherCDKeysModel from '@/models/teacherCDKeys'
import { generateTeacherCDKeys } from '@/api/lesson'
import _ from 'lodash'

const model = teacherCDKeysModel()
const stateMap = [
  {
    key: 0,
    value: '待用'
  },
  {
    key: 1,
    value: '已使用'
  },
  {
    key: 2,
    value: '禁用'
  }
]

export default class TeacherCDKey extends BaseResource {
  static attributes() {
    return [
      {
        name: 'key',
        type: 'String',
        edit: false
      },
      {
        name: 'state',
        type: 'String',
        edit: false,
        filter(value) {
          for (const option of stateMap) {
            if (option.key === value) return option.value
          }
          return value
        }
      },
      {
        name: 'createdAt',
        type: 'Date',
        edit: false
      },
      {
        name: 'teachers.createdAt',
        type: 'Date',
        edit: false,
        search: false
      },
      {
        name: 'userId',
        type: 'Number',
        edit: false
      },
      {
        name: 'username',
        type: 'String',
        edit: false,
        search: false,
        sort: false
      },
      {
        name: 'teachers.school',
        type: 'String',
        edit: false,
        search: false
      },
      {
        name: 'extra.remark',
        type: 'String',
        edit: true,
        search: false
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['create', 'show', 'destroy', 'delete']
    }
  }

  static customFilter() {
    return {
      append: {
        state(object) {
          const state = _.find(stateMap, item => item.value === object.value.trim())
          if (state) {
            return {
              ...object,
              value: state.key
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
          name: '生成激活码',
          type: 'primary',
          refresh: false,
          checkSelected: false,
          async func(selected, that) {
            const params = {
              data: [
                {
                  label: '数量',
                  key: 'count',
                  value: 10
                }
              ],
              type: 'input',
              title: '生成激活码',
              status: 'generateCode'
            }
            that.showDialog(params)
          }
        }
      ],
      callback: {
        async generateCode(inputArr, that) {
          const count = _.get(_.find(inputArr, (item) => item.key === 'count'), 'value', 10)
          const list = await generateTeacherCDKeys(count)
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = that.resourceClass.exportAttrs().map(item => that.i18n(item.name))
            const data = list.map(data =>
              that.resourceClass
                .exportAttrs()
                .map(col => that.colFilter(col, data))
            )
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: 'table-list'
            })
          })
        }
      }
    }
  }
}
