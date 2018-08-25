import { resourceCRUD } from '@/api/lesson'
import BaseResource from './base'

const crudAPI = resourceCRUD('skills')

export default class Skill extends BaseResource {
  attributes() {
    return [
      {
        name: 'id',
        edit: false,
        width: '100px'
      },
      {
        name: 'skillName',
        required: true
      },
      {
        name: 'createdAt',
        edit: false
      }
    ]
  }

  api() {
    return crudAPI
  }

  actions() {
    return {
      disabled: ['show']
    }
  }
}
