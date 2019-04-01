import { resourceCRUD } from '@/api/lesson'
import { resourceCRUD as keepwrokResourceCRUD } from '@/api/keepwork'

const lessonCRUD = resourceCRUD('lessons')
const keepworkCRUD = keepwrokResourceCRUD('users')
const subjectsCRUD = resourceCRUD('subjects')

export default function projectsManageModel() {
  return {
    async list(params) {
      const keys = await lessonCRUD.list(params)
      const userIds = keys.rows.filter((item) => item.state !== 0).map((item) => item.userId)
      const [users, subjects] = await Promise.all([
        keepworkCRUD.list({
          limit: 200,
          where: {
            id: {
              $in: userIds
            }
          }
        }),
        subjectsCRUD.list({
          limit: 200
        })
      ])
      const usersMap = new Map()
      const subjectsMap = new Map()
      users.rows.forEach((user) => usersMap.set(user.id, user.username))
      subjects.rows.forEach(subject => subjectsMap.set(subject.id, subject.subjectName))
      const finalKeys = keys.rows.map((key) => {
        const username = usersMap.get(key.userId)
        const subjectName = subjectsMap.get(key.subjectId)
        return {
          ...key,
          username,
          subjectName
        }
      })
      const list = {
        count: keys.count,
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
