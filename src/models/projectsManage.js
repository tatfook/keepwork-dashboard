import { resourceCRUD } from '@/api/keepwork'

const usersCRUD = resourceCRUD('projects')

export default function projectsManageModel() {
  return {
    async list(params) {
      const projectsManageList = await usersCRUD.list(params)
      projectsManageList.rows.map(item => {
        const base = process.env.KEEPWORK_PREFIX
        item.projectUrl = base + 'pbl/project/' + item.id
      })
      return projectsManageList
    },
    async create(params) {
      return usersCRUD.create(params)
    },
    async update(params) {
      return usersCRUD.update(params)
    },
    async get(params) {
      return usersCRUD.get(params)
    },
    async destroy(params) {
      return usersCRUD.destroy(params)
    },
    async destroyAll(params) {
      for (const index of params.ids || []) {
        await this.destroy({ id: index })
      }
    }
  }
}
