import { resourceCRUD } from '@/api/keepwork'
import BaseResource from './base'

const model = resourceCRUD('pClassifies')

export default class PClassifies extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        edit: false,
        width: '100px'
      },
      {
        name: 'name',
        edit: false,
        type: 'String'
      },
      {
        name: 'filetype',
        type: 'String',
        edit: false
      },
      {
        name: 'pBlockClassifies',
        edit: false,
        type: 'Array'
      },
      {
        name: 'id---',
        type: 'Number',
        edit: false
      },
      {
        name: 'contributor',
        type: 'String',
        edit: false,
        width: '100px'
      },
      {
        name: 'fileUrl',
        edit: false,
        type: 'String'
      },
      {
        name: 'previewUrl',
        type: 'String',
        edit: false
      },
      {
        name: 'useCount',
        edit: false,
        type: 'Number'
      },
      {
        name: 'com',
        type: 'String',
        show: false,
        component: 'pBlockAdd'
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['delete', 'export', 'show', 'destroy']
    }
  }
  static queryFilter(query) {
    // will include all by default, to make sure every associate works
    // query.include(
    // )
    return query
  }
}
