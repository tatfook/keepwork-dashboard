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
    // const selfFilter = {}
    // const associateFilter = {}

    // for (const key in q) {
    //   if (typeof key !== 'string') {
    //     continue
    //   }

    //   const associateMode = key.match(/\$(\w+)\.(\w+)\$-(\w+)/)

    //   if (associateMode) {
    //     const table = associateMode[1]
    //     const name = associateMode[2]
    //     const condition = associateMode[3]
    //     continue
    //   }

    //   const selfMode = key.match(/(\w+)-(\w+)/)

    //   if (selfMode) {
    //     continue
    //   }
    // }
    for (const key in q) {
      const k = key.split('-')
      const v = q[key]

      if (k.length === 2) {
        console.log('self mode!!')
      } else if (k.length === 3) {
        const query = {}
        const as = k[0].match(/(\w+)\[(\w+)\]/)

        if (as) {
          query.as = as[2]
          query['$model$'] = as[1]
        } else {
          query['$model$'] = as[1]
        }

        query.where = {
          [k[1]]: {
            [`$${k[2]}`]: v
          }
        }

        this.include(query)
      } else {
        throw new Error('Invalid query')
      }

      // if (k.length !== 2) throw new Error('Invalid query')
      // k[k.length - 1] = '$' + k[k.length - 1]
      // this.query.where[k[0]] = {
      //   [k[1]]: q[key]
      // }
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
