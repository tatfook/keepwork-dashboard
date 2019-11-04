import { resourceCRUD } from '@/api/keepwork'
import BaseResource from './base'
import _ from 'lodash'

const translator = (parents, children) => {
  _.forEach(parents, parent => {
    _.forEach(children, (current, index) => {
      if (current.parentId === parent.id) {
        const temp = JSON.parse(JSON.stringify(children))
        temp.splice(index, 1)
        translator([current], temp)
        Array.isArray(parent.children)
          ? parent.children.push(current)
          : (parent.children = [current])
      }
    })
  })
}

const generateTags = (tree, arr = [], idx = 0) => {
  _.forEach(tree, item => {
    Array.isArray(arr[idx]) ? arr[idx].push(item.name) : arr[idx] = [item.name]
    if (item.children && item.children.length) {
      generateTags(item.children, arr, idx + 1)
    }
  })
}

const _rewrite = {
  async list(data) {
    const res = await model.list(data)
    const rows = _.get(res, 'rows', [])
    const _rows = _.map(rows, item => {
      const list = _.map(_.get(item, 'pBlockClassifies', []), item => ({ ...item, ...item.pClassifies }))
      const parents = _.filter(list, item => item.parentId === 0)
      const children = _.filter(list, item => item.parentId)
      translator(parents, children)
      const arr = []
      generateTags(parents, children, arr)
      const strTags = arr.map(item => item.join('/')).join(',')
      return { ...item, tags: strTags }
    })
    return { ...res, rows: _rows }
  }
}
const model = resourceCRUD('pBlocks')

export default class PBlocks extends BaseResource {
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
        type: 'String',
        required: true
      },
      {
        name: 'extra.enName',
        edit: false,
        type: 'String'
      },
      {
        name: 'extra.fileName',
        edit: false,
        type: 'String'
      },
      {
        name: 'filetype',
        type: 'String',
        edit: false,
        required: true
      },
      {
        name: 'tags',
        edit: false,
        show: true,
        type: 'Array'
      },
      {
        name: 'size',
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
        name: 'gifUrl',
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
    return { ...model, ..._rewrite }
  }

  static actions() {
    return {
      disabled: ['delete', 'export', 'show']
    }
  }
  static queryFilter(query) {
    // will include all by default, to make sure every associate works
    query.include({
      '$model$': 'pBlockClassifies',
      'as': 'pBlockClassifies',
      'include': [
        {
          '$model$': 'pClassifies',
          'as': 'pClassifies'
        }
      ]
    }
    )
    query.distinct(true)
    return query
  }
}
