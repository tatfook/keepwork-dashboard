import { resourceCRUD } from '../api/keepwork'

const sensitiveWordsCRUD = resourceCRUD('sensitiveWords')

export default function userModel() {
  return {
    async list(params) {
      return sensitiveWordsCRUD.list(params)
    },
    async create(params) {
      const sensitiveWordsParams = params

      const sensitiveWordsList = await sensitiveWordsCRUD.list(sensitiveWordsParams, 'search')

      if (sensitiveWordsList.count === 0) {
        return sensitiveWordsCRUD.create(params)
      } else {
        return false
      }
    },
    async update(params) {
      return sensitiveWordsCRUD.update(params)
    },
    async destroy(params) {
      return sensitiveWordsCRUD.destroy(params)
    }
  }
}
