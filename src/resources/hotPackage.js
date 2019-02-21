import hotPackageModel from '@/models/hotPackage'
import BaseResource from './base'

const hotPackageCRUD = hotPackageModel()

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
        name: 'packageName',
        type: 'String'
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
    return hotPackageCRUD
  }

  static actions() {
    return {
      disabled: ['show']
    }
  }
}
