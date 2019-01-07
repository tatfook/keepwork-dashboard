import { resourceCRUD as lessonCRUD } from '../api/lesson'
import { resourceCRUD as keepworkCRUD } from '../api/keepwork'
import _ from 'lodash'

const tutorCRUD = lessonCRUD('tutors')
const usersCRUD = keepworkCRUD('users')

export default function tutorModel() {
  return {
    async list(params) {
      console.log(params)
      // if (params['userId-eq']) {

      // }

      const tutorList = await tutorCRUD.list(params)

      const userIds = _.map(tutorList.rows, 'userId')

      const usersParams = { 'id-in': userIds }
      const userList = await usersCRUD.list(usersParams)

      const usersMap = new Map()

      for (const item of userList.rows) {
        usersMap.set(item.id, item)
      }

      for (const item of tutorList.rows) {
        if (item.extra && item.extra.tutor) {
          item.tutor = item.extra.tutor
        }

        if (item.endTime > Date.now()) {
          item.status = '正常'
        } else {
          item.status = '已到期'
        }

        const curUser = usersMap.get(item.userId)

        item.cellphone = curUser.cellphone || ''
      }

      return tutorList
    },
    async get() {
      return {}
    },
    async create(params) {
      const createParams = {}

      createParams.userId = params.userId
      createParams.tutorId = params.tutorId
      createParams.startTime = Date.now()
      createParams.endTime = new Date(params.endTime).getTime()
      createParams.extra = {
        tutor: params.tutor || ''
      }

      return tutorCRUD.create(createParams)
    },
    async update(params) {
      const updateParams = {}

      updateParams.id = params.id
      updateParams.tutorId = params.tutorId
      updateParams.endTime = params.endTime
      updateParams.extra = {
        tutor: params.tutor || ''
      }

      return tutorCRUD.update(updateParams)
    },
    async destroy(params) {
      return tutorCRUD.destroy(params)
    }
  }
}
