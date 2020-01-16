import BaseResource from './base'
import { resourceCRUD } from '@/api/keepwork'
import createService from '@/utils/request'
import _ from 'lodash'

const request = createService()
const systemTagsCRUD = resourceCRUD('systemTags')

const projectsCRUD = resourceCRUD('projects')
const model = {
  ...projectsCRUD,
  list(params) {
    const { systemTags, 'users.username': username, ...rest } = params.where
    if (_.get(params.order, [0, 0]) === 'systemTags') {
      params.order = [[
        {
          '$model$': 'systemTags'
        },
        'tagname',
        _.get(params.order, [0, 1])
      ]]
    }

    if (_.get(params.order, [0, 0]) === 'users.username') {
      params.order = [[
        {
          '$model$': 'users'
        },
        'username',
        _.get(params.order, [0, 1])
      ]]
    }

    if (systemTags) {
      params.include.push(
        {
          '$model$': 'systemTags',
          'nest': false,
          'as': 'filterTags',
          'where': {
            'tagname': systemTags
          }
        }
      )
    }
    if (username) {
      params.include.push(
        {
          '$model$': 'users',
          'as': 'users',
          'where': {
            'username': username
          }
        }
      )
    }

    params.where = rest
    // params.order = orderRest || []
    return projectsCRUD.list(params)
  }
}
const cache = {}
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
        name: 'name',
        type: 'String',
        edit: true,
        search: true
      },
      {
        name: 'extra.worldTagName',
        type: 'String',
        isNested: true,
        edit: false,
        search: false
      },
      {
        name: 'type',
        type: 'Number',
        show: true,
        search: false,
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
        edit: true,
        show: true,
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
        search: true
      },
      {
        name: 'users.username',
        type: 'String',
        edit: false,
        show: true,
        search: true,
        sortable: false
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
        name: 'visibility',
        type: 'String',
        show: true,
        search: false,
        filter(value) {
          return value > 0 ? '私有' : '公开'
        }
      },
      {
        name: 'systemTags',
        type: 'String',
        show: true,
        search: true,
        filter(tags) {
          return tags.map(item => item.tagname).join('|')
        },
        sortable: false
      },
      {
        name: 'choicenessNo',
        type: 'String',
        show: true,
        search: true,
        filter(value) {
          return value > 0 ? '精选' : '一般'
        }
      }
    ]
  }

  static model() {
    return model
  }

  static queryFilter(query) {
    // will include all by default, to make sure every associate works
    query.include({ all: true })
    query.distinct(true)
    return query
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
            if (object.op === 'eq') {
              return {
                ...object,
                op: 'gt',
                value: 0
              }
            }
            if (object.op === 'ne') {
              return {
                ...object,
                op: 'eq',
                value: 0
              }
            }
          }

          if (object.value === '一般') {
            if (object.op === 'ne') {
              return {
                ...object,
                op: 'gt',
                value: 0
              }
            }
            return {
              ...object,
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
          async func(projects, that) {
            return new Promise((resolve, reject) => {
              that.$confirm('确认批量设置精选?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(async() => {
                await Promise.all(projects.map(item => projectsCRUD.update({ ...item, choicenessNo: 1 })))
                resolve()
              })
            })
          }
        },
        {
          name: '取消精选',
          type: 'danger',
          async func(projects, that) {
            return new Promise((resolve, reject) => {
              that.$confirm('确认批量取消精选?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(async() => {
                await Promise.all(projects.map(item => projectsCRUD.update({ ...item, choicenessNo: 0 })))
                resolve()
              })
            })
          }
        },
        {
          name: '设置系统标签',
          type: 'primary',
          refresh: false,
          async func(projects, that) {
            const res = await systemTagsCRUD.list(
              { 'where': { 'classify': { '$eq': 1 }}, 'include': [{ 'all': true, 'nested': false }], 'order': [], 'limit': 300, 'offset': 0 }
            )
            const tags = _.get(res, 'rows', [])
            const params = {
              type: 'checkbox',
              data: tags.map(item => ({ label: item.tagname, value: item.id })),
              status: 'addSystemTags'
            }
            that.showDialog(params)
            cache['projects'] = projects
            cache['tags'] = tags
          }
        },
        {
          name: '取消系统标签',
          type: 'danger',
          refresh: false,
          async func(projects, that) {
            const res = await systemTagsCRUD.list(
              { 'where': { 'classify': { '$eq': 1 }}, 'include': [{ 'all': true, 'nested': false }], 'order': [], 'limit': 300, 'offset': 0 }
            )
            const tags = _.get(res, 'rows', [])
            const params = {
              type: 'checkbox',
              data: tags.map(item => ({ label: item.tagname, value: item.id })),
              status: 'removeSystemTags'
            }
            that.showDialog(params)
            cache['projects'] = projects
            cache['tags'] = tags
          }
        }
      ],
      callback: {
        async addSystemTags(selectedTagIDS, that) {
          const { projects } = cache
          const tags = selectedTagIDS.map(id => ({ tagId: id }))
          await Promise.all(projects.map(item => {
            return request({
              method: 'post',
              url: `/admins/projects/${item.id}/systemTags`,
              data: {
                tags
              }
            })
          }))
        },
        async removeSystemTags(selectedTagIDS, that) {
          const { projects } = cache
          await Promise.all(projects.map(item => {
            return request({
              method: 'DELETE',
              url: `/admins/projects/${item.id}/systemTags`,
              data: {
                tagIds: selectedTagIDS
              }
            })
          }))
        }
      }
    }
  }
}
