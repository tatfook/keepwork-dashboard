import { resourceCRUD } from '@/api/lesson'

const usersCRUD = resourceCRUD('users')
const lessonsCRUD = resourceCRUD('lessons')
const packageLessons = resourceCRUD('packageLessons')

export default function hotPackageModel() {
  return {
    async list(params) {
      const _lessons = await packageLessons.list(params)
      const usersId = _lessons.rows.map(item => item.userId)
      const lessonsId = _lessons.rows.map(item => item.lessonId)

      const userMap = new Map()
      const lessonMap = new Map()

      const [users, lessons] = await Promise.all([
        usersCRUD.list({
          limit: 200,
          where: {
            id: {
              $in: usersId
            }
          }
        }),
        lessonsCRUD.list({
          limit: 200,
          where: {
            id: {
              $in: lessonsId
            }
          }
        })
      ])
      users.rows.forEach(item => userMap.set(item.id, item.username))
      lessons.rows.forEach(item => lessonMap.set(item.id, item.lessonName))
      const finalLesson = _lessons.rows.map(item => {
        return {
          ...item,
          lessonName: lessonMap.get(item.lessonId),
          username: userMap.get(item.userId)
        }
      })
      return {
        count: _lessons.count,
        rows: finalLesson
      }
    },
    async create(params) {
      return packageLessons.create(params)
    },
    async update(params) {
      return packageLessons.update(params)
    },
    async get(params) {
      return packageLessons.get(params)
    },
    async destroy(params) {
      return packageLessons.destroy(params)
    },
    async destroyAll(params) {
      for (const index of params.ids || []) {
        await this.destroy({ id: index })
      }
    }
  }
}
