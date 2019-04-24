import { resourceCRUD } from '@/api/keepwork'
import BaseResource from './base'

const model = resourceCRUD('messages')

export default class Messages extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        show: true,
        edit: false,
        search: true
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['show', 'delete', 'create', 'destroy']
    }
  }
}
