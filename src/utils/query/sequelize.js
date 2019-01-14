import _ from 'lodash'

export default class SequelizeQuery {
  constructor() {
    this.query = {
      where: {},
      include: [],
      order: []
    }
  }

  static associateKey(model, name) {
    // return `${_.snakeCase(model)}-${name}`
    return `${model}-${name}`
  }

  static queryKey(attr, op) {
    return attr + '-' + op
  }

  where(q = {}) {
    for (const key in q) {
      const k = key.split('-')
      const v = q[key]

      if (k.length === 2) {
        this.query.where = {
          [k[0]]: {
            [`$${k[1]}`]: v
          }
        }
      } else if (k.length === 3) {
        const query = {}

        const asName = k[0].match(/(\w+)\[(\w+)\]/)

        if (asName && asName[1] && asName[2]) {
          query.as = asName[2]
          query['$model$'] = asName[1]
        } else if (k[0]) {
          query['$model$'] = k[0]
        }

        query.where = {
          [k[1]]: {
            [`$${k[2]}`]: v
          }
        }

        if (this.query && this.query.include) {
          for (const index in this.query.include) {
            const item = this.query.include[index]

            if (
              item['$model$'] === query['$model$'] ||
              item['as'] === query['as']
            ) {
              _.pullAt(this.query.include, index)
            }
          }
        }

        this.include(query)
      } else {
        throw new Error('Invalid query')
      }
    }
    return this
  }

  paginate(page = 1, perPage = 10) {
    this.query.limit = perPage
    this.query.offset = perPage * (page - 1)
    return this
  }

  // example: createdAt-DESC => rule: ['createdAt', 'DESC']
  // nested: user-createdAt-DESC => rule: ['User', 'createdAt', 'DESC']
  order(str) {
    if (!str) return this
    const rule = str.split('-')
    if (rule.length < 2) throw new Error('Invalid order')
    for (let i = 0; i < rule.length - 2; i++) {
      rule[i] = _.capitalize(rule[i])
    }
    this.query.order.push(rule)
    return this
  }

  include(rule) {
    this.query.include.push(rule)
    return this
  }
}
