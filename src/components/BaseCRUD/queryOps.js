const commonOps = [{
  key: 'eq',
  value: 'equal'
},
{
  key: 'ne',
  value: 'not equal'
},
{
  key: 'in',
  value: 'in'
},
{
  key: 'notIn',
  value: 'not in'
}
]

export const queryOps = {
  'Number': commonOps.concat([{
    key: 'gt',
    value: 'great than'
  },
  {
    key: 'gte',
    value: 'great or equal'
  },
  {
    key: 'lt',
    value: 'less than'
  },
  {
    key: 'lte',
    value: 'less or equal'
  }
  ]),
  'String': commonOps.concat([{
    key: 'like',
    value: 'like'
  },
  {
    key: 'notLike',
    value: 'not like'
  }
  ]),
  'Date': commonOps.concat([{
    key: 'gt',
    value: 'great than'
  },
  {
    key: 'gte',
    value: 'great or equal'
  },
  {
    key: 'lt',
    value: 'less than'
  },
  {
    key: 'lte',
    value: 'less or equal'
  }
  ])
}

export const getQueryOps = (type) => {
  return queryOps[type] || commonOps
}

export const parseQuery = ({
  name,
  op,
  value
}) => {
  const key = name + '-' + op
  switch (op) {
    case 'like':
    case 'notLike':
      return {
        [key]: value + '%'
      }
    case 'in':
    case 'notIn':
      return {
        [key]: value.split(',')
      }
    default:
      return {
        [key]: value
      }
  }
}
