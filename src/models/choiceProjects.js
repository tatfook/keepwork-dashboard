import { resourceCRUD } from '@/api/keepwork'

const projectsCRUD = resourceCRUD('projects')
const usersCRUD = resourceCRUD('users')
import _ from 'lodash'

export default function choiceProjectsModel() {
  return {
    async list(params) {
      params.where['choicenessNo'] = params.where['choicenessNo'] || { $gte: 100 }
      if (params.order) {
        params.order.push(['choicenessNo', 'desc'])
      }
      const projects = await projectsCRUD.list(params)
      const userIds = projects.rows.map(item => item.userId)
      const users = await usersCRUD.list({
        limit: 200,
        where: {
          id: {
            $in: userIds
          }
        }
      })
      const usersMap = new Map()
      users.rows.forEach(user => usersMap.set(user.id, user.username))
      const finalProjects = projects.rows.map((item, index) => {
        const username = usersMap.get(item.userId)
        return {
          ...item,
          username
        }
      })
      const _project = _.map(_.reverse(_.sortBy(finalProjects, item => item.choicenessNo)), (item, index) => ({
        ...item,
        number: index + 1
      }))
      const list = {
        count: projects.count,
        rows: _project
      }
      return list
    },
    async create(params) {
      return projectsCRUD.create(params)
    },
    async update(params) {
      return projectsCRUD.update(params)
    },
    async get(params) {
      return projectsCRUD.get(params)
    },
    async destroy(params) {
      return projectsCRUD.destroy(params)
    },
    async destroyAll(params) {
      for (const index of params.ids || []) {
        await this.destroy({ id: index })
      }
    }
  }
}
