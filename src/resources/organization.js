import { resourceCRUD } from '@/api/keepwork'
import organizationModel from '@/models/organization'
import BaseResource from './base'

const model = { ...resourceCRUD('lessonOrganizations'), ...organizationModel }
const ENV = process.env.NODE_EN
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
        search: false
      },
      {
        name: 'endDate',
        type: 'Date',
        component: 'time',
        search: false
      },
      {
        name: 'count',
        type: 'Number',
        search: false,
        default: 100
      },
      {
        name: 'status',
        type: 'String',
        edit: false
      }
      // {
      //   name: 'privilege',
      //   type: 'Number',
      //   component: 'select'
      // }
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
      $model$: 'lessonOrganizationClassMembers',
      where: {roleId: { $eq: 64 }, classId: { $eq: 0 }},
      include: [
        {
          as: 'users',
          $model$: 'users'
        }
      ]
    })
    query.include({
      as: 'lessonOrganizationPackages',
      $model$: 'lessonOrganizationPackages',
      where: { classId: { $eq: 0 } },
    })
    return query
  }
}
