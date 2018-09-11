import {
  resourceCRUD
} from '@/api/lesson'
import BaseResource from './base'

const crudAPI = resourceCRUD('skills')

export default class Skill extends BaseResource {
  static attributes() {
    return [{
      name: 'id',
      type: 'Number',
      edit: false,
      width: '100px'
    },
    {
      name: 'skillName',
      type: 'String',
      required: true
    },
    {
      name: 'enSkillName',
      type: 'String'
    },
    {
      name: 'createdAt',
      type: 'Date',
      edit: false
    }
    ]
  }

  static api() {
    return crudAPI
  }

  static actions() {
    return {
      disabled: ['show']
    }
  }
}
