import { resourceCRUD } from '@/api/keepwork'
import BaseResource from './base'

const model = resourceCRUD('paracraftVisitors')

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
        name: 'realname',
        type: 'String',
        search: true
      },
      {
        name: 'cellphone',
        type: 'Number',
        show: true,
        edit: false,
        search: true
      },
      {
        name: 'email',
        type: 'String',
        search: true
      },
      {
        name: 'organization',
        type: 'String',
        search: true
      },
      {
        name: 'description',
        type: 'String',
        search: true
      },
      {
        name: 'createdAt',
        type: 'Date',
        search: true
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['edit', 'delete', 'create', 'destroy']
    }
  }
}
