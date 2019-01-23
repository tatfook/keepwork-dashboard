import { resourceCRUD } from '@/api/lesson'
import { resourceCRUD as keepwrokResourceCRUD } from '@/api/keepwork'

const lessonCRUD = resourceCRUD('teacherCDKeys')
const keepworkCRUD = keepwrokResourceCRUD('users')

export default function projectsManageModel() {
  return {
    async list(params) {
      const keys = await lessonCRUD.list(params)
      const userIds = keys.rows.filter((item) => item.state !== 0).map((item) => item.userId)
      const users = await keepworkCRUD.list({
        limit: 200,
        where: {
          id: {
            $in: userIds
          }
        }
      })
      const usersMap = new Map()
      users.rows.forEach((user) => usersMap.set(user.id, user.username))
      const finalKeys = keys.rows.map((key) => {
        const username = usersMap.get(key.userId)
        return {
          ...key,
          username
        }
      })
      const list = {
        count: finalKeys.length,
        rows: finalKeys
      }
      return list
    },
    async create(params) {
      return lessonCRUD.create(params)
    },
    async update(params) {
      return lessonCRUD.update(params)
    },
    async get(params) {
      return lessonCRUD.get(params)
    },
    async destroy(params) {
      return lessonCRUD.destroy(params)
    },
    async destroyAll(params) {
      for (const index of params.ids || []) {
        await this.destroy({ id: index })
      }
    }
  }
}
