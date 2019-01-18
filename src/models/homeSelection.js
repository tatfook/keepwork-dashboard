import { resourceCRUD } from '@/api/keepwork'

const projectsCRUD = resourceCRUD('projects')

export default function projectsManageModel() {
  return {
    async list(params) {
      // const projects = await projectsCRUD.list(params)
      // console.log(projects)

      const projectsList = await projectsCRUD.list({ 'choicenessNo-ne': 1 }, 'search')
      console.log(projectsList)

      return projectsList
    },
    async create(params) {
      return projectsCRUD.create(params)
    },
    async update(params) {
      return projectsCRUD.update(params)
    }
    // async get(params) {
    //   return projectsCRUD.get(params)
    // },
    // async destroy(params) {
    //   return projectsCRUD.destroy(params)
    // },
    // async destroyAll(params) {
    //   for (const index of params.ids || []) {
    //     await this.destroy({ id: index })
    //   }
    // }
  }
}
