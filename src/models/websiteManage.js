import { resourceCRUD } from '../api/keepwork'
const websitesCRUD = resourceCRUD('sites')

export default function websiteManageModel() {
  return {
    async list(params) {
      const websitesParams = params

      const websitesList = await websitesCRUD.list(websitesParams)

      return websitesList
    },
    async create(params) {
      return websitesCRUD.create(params)
    },
    async update(params) {
      return websitesCRUD.update(params)
    },
    async destroy(params) {
      return websitesCRUD.destroy(params)
    }
  }
}
