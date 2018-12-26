import { resourceCRUD } from '@/api/lesson'
import BaseResource from './base'

const model = resourceCRUD('packageSorts')

export default class HotPackage extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        edit: false,
        width: '100px'
      },
      {
        name: 'packageId',
        type: 'Number',
        required: true,
        associate: 'Package'
      },
      {
        name: 'hotNo',
        type: 'Number'
      },
      {
        name: 'createdAt',
        type: 'Date',
        edit: false
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['show']
    }
  }
}
