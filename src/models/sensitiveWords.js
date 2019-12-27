import { resourceCRUD } from '../api/keepwork'
import { Message } from 'element-ui'

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
        Message({
          message: '敏感词已存在',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject('重复')
      }
    },
    async update(params) {
      return sensitiveWordsCRUD.update(params)
    },
    async destroy(params) {
      return sensitiveWordsCRUD.destroy(params)
    },
    async destroyAll(params) {
      for (const index of params.ids || []) {
        await this.destroy({ id: index })
      }
    }
  }
}
