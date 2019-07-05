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
export default class NPLwork extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        edit: false,
        width: '100px'
      },
      {
        name: 'worksLogo',
        type: 'Number',
        edit: true,
        width: '100px',
        show: false,
        component: 'workAdd'
      },
      {
        name: 'games.name',
        type: 'String',
        edit: false
      },
      {
        name: 'games.no',
        type: 'Number',
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
        type: 'String',
        edit: false
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
        type: 'String',
        edit: false
      },
      {
        name: 'projects.users.userinfos.school',
        type: 'String',
        search: false,
        edit: false
      },
      {
        name: 'reward',
        type: 'String',
        component: 'select',
        options: rewardMap,
        edit: false,
        filter(value) {
          return value === '' ? '否' : value === '1' ? '是' : value
        }
      },
      {
        name: 'extra.projects',
        type: 'String',
        edit: false,
        search: false,
        filter(value) {
          return value ? '已备份' : ''
        }
      }
    ]
  }
  static model() {
    return model
  }
  static actions() {
    return {
      disabled: ['show', 'delete', 'destroy'],
      extra: [{
        name: 'backup',
        button: 'success',
        title() {
          return '备份'
        },
        async func(row, that) {
          if (row.projects) {
            await model.update({ ...row, extra: { projects: row.projects }})
          }
        }
      }]
    }
  }

  static buttons() {
    return {
      append: [{
        name: '备份',
        type: 'success',
        async func(projects, that) {
          const _projects = projects.filter(item => item.projects)
          const fetchUpdateProjects = _projects.map(item => model.update({ ...item, extra: { projects: item.projects }}))
          await Promise.all(fetchUpdateProjects)
        }
      }]
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
    query.include(
      {
        as: 'games',
        '$model$': 'games'
      }
    )
    return query
  }
}
