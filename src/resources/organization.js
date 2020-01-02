import { resourceCRUD } from '@/api/lesson'
import organizationModel from '@/models/organization'
import BaseResource from './base'
import _ from 'lodash'
const cache = {}

const model = { ...resourceCRUD('lessonOrganization'), ...organizationModel }
const ENV = process.env.NODE_EN

const visibilityMap = [{
  key: 0,
  value: '公开'
}, {
  key: 1,
  value: '不公开'
}]
export default class Organization extends BaseResource {
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
        name: 'usernames',
        type: 'String',
        show: true,
        search: false,
        required: true
      },
      {
        name: 'location',
        type: 'String',
        show: true,
        component: 'areaDistpicker',
        search: true,
        edit: true
      },
      {
        name: 'userId',
        type: 'Number',
        edit: false,
        show: false,
        search: false
      },
      {
        name: 'name',
        type: 'String',
        show: true,
        required: true
      },
      {
        name: 'logo',
        type: 'String',
        search: false,
        show: false
      },
      {
        name: 'loginUrl',
        type: 'String',
        component: 'org',
        search: false,
        required: true,
        requiredTrigger: 'blur',
        filter(url) {
          if (ENV === 'stage' || ENV === 'release') {
            return `${ENV}.keepwork.com/org/${url}`
          }
          return `keepwork.com/org/${url}`
        }
      },
      {
        name: 'cellphone',
        type: 'Number',
        search: true
      },
      {
        name: 'email',
        type: 'String',
        search: true
      },
      {
        name: 'lessonOrganizationPackages',
        type: 'Array',
        component: 'package',
        search: false,
        show: false,
        edit: true
      },
      {
        name: 'startDate',
        type: 'Date',
        component: 'time',
        search: false,
        required: true
      },
      {
        name: 'endDate',
        type: 'Date',
        component: 'time',
        search: false,
        required: true
      },
      {
        name: 'activateCodeLimit',
        type: 'Object',
        search: false,
        component: 'ActivateCodeLimit',
        filter(obj) {
          return `3个月(${obj['type5'] || 0}个),
          半年(${obj['type6'] || 0}个),
          一年送3个月(${obj['type7'] || 0}个)
  `
        }
      },
      {
        name: 'activateCodeUsed',
        search: false,
        type: 'Object',
        edit: false,
        filter(obj) {
          return `3个月(${obj[5] || 0}个),
                  半年(${obj[6] || 0}个),
                  一年送3个月(${obj[7] || 0}个)
          `
        }
      },
      {
        name: 'teacherCount',
        type: 'Array',
        search: false,
        edit: false
      },
      {
        name: 'status',
        type: 'String',
        edit: false
      },
      {
        name: 'visibility',
        type: 'Array',
        options: visibilityMap,
        component: 'select',
        filter(value) {
          return _.get(_.find(visibilityMap, item => item.key === value), 'value', visibilityMap[1].value)
        }
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['show', 'delete', 'destroy']
    }
  }

  static buttons() {
    return {
      append: [
        {
          name: '批量设置课程包',
          type: 'warning',
          refresh: false,
          async func(organizations, that) {
            const organizationIDs = organizations.map(item => item.id)
            that.showCustomDialog({
              type: 'packageSelect',
              data: organizationIDs
            })
            cache['organizationIDs'] = organizationIDs
          }
        }
      ],
      callback: {
        async batchAddPackage(packageList, that) {
          const organizationIDs = cache['organizationIDs']
          console.log(packageList)
          console.log(organizationIDs)
        }
      }
    }
  }

  static queryFilter(query) {
    // will include all by default, to make sure every associate works
    query.include({
      as: 'lessonOrganizationClassMembers',
      $model$: 'LessonOrganizationClassMember',
      where: {
        roleId: {
          '$in': [2, 3, 66, 67, 65, 64]
        }
      },
      required: false,
      include: [
        {
          as: 'users',
          $model$: 'User'
        }
      ]
    })
    query.include({
      as: 'lessonOrganizationPackages',
      $model$: 'LessonOrganizationPackage',
      required: false,
      where: { classId: { $eq: 0 }}
    })

    query.distinct(true)
    return query
  }
}
