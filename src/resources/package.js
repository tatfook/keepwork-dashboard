import { resourceCRUD } from '@/api/keepwork'
import pacakgeModel from '@/models/package'
import { getUserToken } from '@/api/getToken'
import BaseResource from './base'
import createService from '@/utils/request'
const request = createService()
const packageTagsCRUD = resourceCRUD('systemTags')
const cache = {}

const model = pacakgeModel()
const stateMap = [
  {
    key: 0,
    value: '新创建'
  },
  {
    key: 1,
    value: '审核中'
  },
  {
    key: 2,
    value: '审核通过'
  },
  {
    key: 3,
    value: '审核不通过'
  },
  {
    key: 4,
    value: '下架'
  }
]

const KEEPWORK_PREFIX = process.env.KEEPWORK_PREFIX

export default class Package extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        edit: false,
        width: '100px'
      },
      {
        name: 'packageName',
        type: 'String',
        title: true,
        required: true
      },
      {
        name: 'intro',
        type: 'String',
        component: 'text',
        show: false,
        search: false
      },
      {
        name: 'userId',
        type: 'Number',
        required: true,
        component: 'select',
        show: false,
        edit: true,
        associate: 'User'
      },
      {
        name: 'username',
        type: 'String',
        search: false,
        edit: false,
        sortable: false
      },
      {
        name: 'subjectId',
        type: 'Number',
        required: true,
        component: 'select',
        associate: 'Subject',
        show: false
      },
      {
        name: 'subjectName',
        type: 'String',
        edit: false,
        search: false,
        sortable: false
      },
      {
        name: 'minAge',
        type: 'Number',
        required: true
      },
      {
        name: 'maxAge',
        type: 'Number',
        required: true
      },
      {
        name: 'state',
        type: 'Number',
        required: true,
        component: 'select',
        options: stateMap,
        filter: value => {
          for (const option of stateMap) {
            if (option.key === value) return option.value
          }
          return value
        }
      },
      {
        name: 'refuseMsg',
        type: 'String',
        component: 'text',
        search: false
      },
      {
        name: 'rmb',
        type: 'Number',
        required: true,
        show: true,
        edit: true,
        search: true
      },
      {
        name: 'coin',
        type: 'Number',
        required: true,
        show: true,
        edit: true,
        search: true
      },
      {
        name: 'coverUrl',
        type: 'String',
        show: false,
        search: false
      },
      {
        name: 'createdAt',
        type: 'Date',
        edit: false
      },
      {
        name: 'tags',
        type: 'Array',
        edit: true,
        search: true,
        show: false,
        component: 'packageTags'
      },
      {
        name: 'tagNames',
        type: 'Array',
        edit: false,
        search: false,
        show: true,
        filter(value) {
          return value.join(',')
        },
        sortable: false
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['show'],
      extra: [{
        name: 'view',
        title() {
          return '预览'
        },
        async func(row, that) {
          const { userId, id } = row
          const token = await getUserToken(userId)
          if (token) {
            window.open(`${KEEPWORK_PREFIX}/l/preview/package/${id}?token=${token}`, '_blank')
          }
        }
      }]
    }
  }

  static buttons() {
    return {
      append: [{
        name: '设置标签',
        type: 'primary',
        refresh: false,
        async func(packages, that) {
          const res = await packageTagsCRUD.list({
            limit: 200,
            where: { classify: { $eq: 2 }}
          })
          const params = {
            type: 'checkbox',
            data: res.rows.map(item => ({ label: item.tagname, value: item.id })),
            status: 'addPackageTags'
          }
          that.showDialog(params)
          cache['packages'] = packages
        }
      }, {
        name: '取消设置标签',
        type: 'danger',
        refresh: true,
        async func(packages, that) {
          return new Promise((resolve, reject) => {
            that.$confirm('确认批量取消设置标签?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async() => {
              const deleteRequests = packages.map(item => request({
                method: 'delete',
                url: 'admins/tags/bulk',
                data: {
                  query: {
                    objectId: item.id
                  }
                }
              }))
              await Promise.all(deleteRequests)
              resolve()
            })
          })
        }
      }],
      callback: {
        async addPackageTags(selectedTags, that) {
          const { packages } = cache
          const packagesTags = packages.map(item => selectedTags.map(tag => ({
            packageId: item.id,
            tagId: tag
          })))
          const addTags = packagesTags.flat(Infinity).map(item => ({
            objectId: item.packageId,
            objectType: 8,
            tagId: item.tagId
          }))
          const deleteRequests = packages.map(item => request({
            method: 'delete',
            url: 'admins/tags/bulk',
            data: {
              query: {
                objectId: item.id
              }
            }
          }))
          await Promise.all(deleteRequests)
          return request({
            method: 'post',
            url: 'admins/tags/bulk',
            data: {
              datas: addTags
            }
          })
        }
      }
    }
  }

  static customFilter() {
    return {
      append: {
        state(object) {
          for (const item of stateMap) {
            if (item.value === object.value.trim()) {
              return { ...object, value: item.key }
            }
          }
          return object
        }
      }
    }
  }

  static queryFilter(query) {
    // will include all by default, to make sure every associate works
    query.include({ 'as': 'User', '$model$': 'User', 'attributes': ['username'] })
    return query
  }
}
