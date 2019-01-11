import { resourceCRUD } from '../api/keepwork'
const websiteSuspendCRUD = resourceCRUD('illegals')

export default function websiteSuspendModel() {
  return {
    async list(params) {
      params.where['objectType'] = 1
      const websiteSuspendParams = params

      const websiteSuspendList = await websiteSuspendCRUD.list(websiteSuspendParams)

      return websiteSuspendList
    },
    async create(params) {
      if (typeof params === 'object') {
        params['objectType'] = 1
      }
      return websiteSuspendCRUD.create(params)
    },
    async update(params) {
      return websiteSuspendCRUD.update(params)
    },
    async destroy(params) {
      return websiteSuspendCRUD.destroy(params)
    },
    async destroyAll(params) {
      for (const index of params.ids || []) {
        await this.destroy({ id: index })
      }
    }
  }
}
