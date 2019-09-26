import { resourceCRUD } from '@/api/lesson'
import organizationModel from '@/models/organization'
import BaseResource from './base'
import _ from 'lodash'

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
        type: 'Array',
        show: true,
        search: false,
        filter(names) {
          return Array.isArray(names) ? names.join(',') : names
        },
        required: true
      },
      {
        name: 'location',
        type: 'Array',
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
        name: 'count',
        type: 'Number',
        search: false,
        default: 100
      },
      {
        name: 'teacherCount',
        type: 'Number',
        search: false,
        edit: false
      },
      {
        name: 'studentCount',
        type: 'Number',
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
        type: 'Number',
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

  static queryFilter(query) {
    // will include all by default, to make sure every associate works
    query.include({
      as: 'lessonOrganizationClassMembers',
      $model$: 'LessonOrganizationClassMember',
      where: { roleId: { $eq: 64 }, classId: { $eq: 0 }},
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
    return query
  }
}
