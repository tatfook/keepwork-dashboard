import { resourceCRUD } from '@/api/lesson'
import { resourceCRUD as keepwrokResourceCRUD } from '@/api/keepwork'
import createService from '@/utils/request'
const request = createService()

const packageCRUD = resourceCRUD('packages')
const keepworkCRUD = keepwrokResourceCRUD('users')
const subjectsCRUD = resourceCRUD('subjects')
const tagsCRUD = keepwrokResourceCRUD('tags')
const packageTagsCRUD = keepwrokResourceCRUD('systemTags')

export default function projectsManageModel() {
  return {
    async list(params) {
      const keys = await packageCRUD.list(params)
      const userIds = keys.rows.filter((item) => item.state !== 0).map((item) => item.userId)
      const packageIds = keys.rows.map(item => item.id)
      const [users, subjects, packageTags, tags] = await Promise.all([
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
        }),
        packageTagsCRUD.list({
          limit: 200,
          where: { classify: { $eq: 2 }}
        }),
        tagsCRUD.list({
          limit: 200,
          where: {
            objectId: {
              $in: packageIds
            },
            objectType: 8
          }
        })
      ])
      const packageTagsObject = packageTags.rows.reduce((obj, cur) => {
        obj[cur.id] = cur.tagname
        return obj
      }, {})
      const tagIdObject = tags.rows.reduce((obj, cur) => {
        const tagId = Number(cur.tagId)
        if (Array.isArray(obj[cur.objectId])) {
          obj[cur.objectId].push(tagId)
        } else {
          obj[cur.objectId] = [tagId]
        }
        return obj
      }, {})
      const tagNameObject = Object.keys(tagIdObject).reduce((obj, curId) => {
        obj[curId] = tagIdObject[curId].map(id => packageTagsObject[id])
        return obj
      }, {})
      const usersMap = new Map()
      const subjectsMap = new Map()
      users.rows.forEach((user) => usersMap.set(user.id, user.username))
      subjects.rows.forEach(subject => subjectsMap.set(subject.id, subject.subjectName))
      const finalKeys = keys.rows.map((key) => {
        const username = usersMap.get(key.userId)
        const subjectName = subjectsMap.get(key.subjectId)
        const tags = tagIdObject[key.id]
        const tagNames = tagNameObject[key.id]
        return {
          ...key,
          tags,
          tagNames,
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
      const packageObject = await packageCRUD.create(params)
      const { tags = [] } = params
      const _addTags = tags.map(item => ({ objectId: packageObject.id, objectType: 8, tagId: item }))
      return request({
        method: 'post',
        url: 'admins/tags/bulk',
        data: {
          datas: _addTags
        }
      })
    },
    async update(params) {
      const { tags, ...rest } = params
      await request({
        method: 'delete',
        url: 'admins/tags/bulk',
        data: {
          query: {
            objectId: params.id
          }
        }
      })
      const _addTags = tags.map(item => ({ objectId: params.id, objectType: 8, tagId: item }))
      await request({
        method: 'post',
        url: 'admins/tags/bulk',
        data: {
          datas: _addTags
        }
      })
      return packageCRUD.update(rest)
    },
    async get(params) {
      return packageCRUD.get(params)
    },
    async destroy(params) {
      await request({
        method: 'delete',
        url: 'admins/tags/bulk',
        data: {
          query: {
            objectId: params.id
          }
        }
      })
      return packageCRUD.destroy(params)
    },
    async destroyAll(params) {
      for (const index of params.ids || []) {
        await request({
          method: 'delete',
          url: 'admins/tags/bulk',
          data: {
            query: {
              objectId: params.id
            }
          }
        })
        await this.destroy({ id: index })
      }
    }
  }
}
