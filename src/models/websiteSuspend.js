import { resourceCRUD } from '../api/keepwork'
const websiteSuspendCRUD = resourceCRUD('illegalSites')

export default function websiteSuspendModel() {
  return {
    async list(params) {
      const websiteSuspendParams = params

      const websiteSuspendList = await websiteSuspendCRUD.list(websiteSuspendParams)

      return websiteSuspendList
    },
    async create(params) {
      return websiteSuspendCRUD.create(params)
    },
    async update(params) {
      return websiteSuspendCRUD.update(params)
    },
    async destroy(params) {
      return websiteSuspendCRUD.destroy(params)
    }
  }
}
