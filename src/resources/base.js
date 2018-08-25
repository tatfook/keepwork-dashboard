// Base Model for resources
export default class BaseResource {
  constructor(row) {
    const attrs = this.attributes()
    this.data = {}
    this.nested = []
    if (row) {
      for (const attr of attrs) {
        if (row[attr.name]) {
          this.data[attr.name] = row[attr.name]
          if (attr.associate) {
            this.nested.push(attr)
          }
        }
      }
    }
  }

  // resource name, eg: user
  resource() {
    return self.constructor.name
  }

  // resource rest API
  api() {
    throw new Error('Please define the resource API!')
  }

  // define the reference key of current resource. eg: userId
  reference() {
    return this.resource() + 'Id'
  }

  // will replace the reference key while rendering
  title() {
    return this.data.name
  }

  /*
    resource attributes
    example:
    [
      {
        name: 'title',
        required: true,
        width: '100px',
        rules: [
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change'}
        ],
        filter: (value) => {
          const statusMap = {
            0: '待用',
            1: '已使用',
            2: '禁用'
          }
          return statusMap[status]
        }
      }
    ]
  */
  attributes() {
    return []
  }

  /*
    resource action settings, including disabled and extra actions.
    default actions are ['create', 'destroy', 'update', 'download'].
    example:
      {
        disabled: ['destroy'],
        extra: [
          {
            name: 'publish',
            func: (row) => {alert(row.id)},
            type: 'normal'
          }
        ]
      }
  */
  actions() {
    return {
      disabled: [], // ['create', 'edit', 'destroy', 'show']
      extra: []
    }
  }
}
