import { resourceCRUD } from '@/api/keepwork'
import BaseResource from './base'

const model = resourceCRUD('gameWorks')

const rewardMap = [
  {
    key: '一等奖',
    value: '一等奖'
  },
  {
    key: '二等奖',
    value: '二等奖'
  },
  {
    key: '三等奖',
    value: '三等奖'
  },
  {
    key: '人气奖',
    value: '人气奖'
  }
]
export default class NPLApply extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        edit: false,
        width: '100px'
      },
      {
        name: 'games.name',
        type: 'String',
        edit: false
      },
      {
        name: 'projectId',
        type: 'Number',
        edit: false
      },
      {
        name: 'worksName',
        type: 'String',
        edit: false
      },
      {
        name: 'createdAt',
        type: 'Date',
        edit: false
      },
      {
        name: 'worksSubject',
        type: 'String'
      },
      {
        name: 'worksRate',
        type: 'Number',
        search: false,
        edit: false
      },
      {
        name: 'worksRateCount',
        type: 'String',
        search: false,
        edit: false
      },
      {
        name: 'projects.users.userinfos.name',
        type: 'String'
      },
      {
        name: 'projects.users.userinfos.school',
        type: 'String',
        search: false
      },
      {
        name: 'reward',
        type: 'String',
        component: 'select',
        options: rewardMap
      }
    ]
  }
  static model() {
    return model
  }
  static actions() {
    return {
      disabled: ['show', 'create', 'delete', 'destroy']
    }
  }

  static queryFilter(query) {
    // will include all by default, to make sure every associate works
    query.include({
      as: 'projects',
      '$model$': 'projects',
      include: [
        {
          as: 'users',
          '$model$': 'users',
          include: [
            {
              as: 'userinfos',
              '$model$': 'userinfos'
            }
          ]
        }
      ]
    })
    return query
  }
}
