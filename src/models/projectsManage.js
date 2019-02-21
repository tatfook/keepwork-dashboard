import { resourceCRUD } from '@/api/keepwork'

const projectsCRUD = resourceCRUD('projects')
const usersCRUD = resourceCRUD('users')

export default function projectsManageModel() {
  return {
    async list(params) {
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
      const finalProjects = projects.rows.map(item => {
        const username = usersMap.get(item.userId)
        return {
          ...item,
          username
        }
      })
      const list = {
        count: projects.count,
        rows: finalProjects
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
