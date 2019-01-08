import { resourceCRUD as lessonCRUD } from '../api/lesson'
// import { resourceCRUD as keepworkCRUD } from '../api/keepwork'
// import _ from 'lodash'

const tutorCRUD = lessonCRUD('tutors')

export default function tutorModel() {
  return {
    async list(params) {
      console.log(params)
      const tutorList = await tutorCRUD.list(params)

      for (const item of tutorList.rows) {
        if (item.extra && item.extra.tutor) {
          item.comment = item.extra.tutor
        }

        if (item.endTime > Date.now()) {
          item.status = '正常'
        } else {
          item.status = '已到期'
        }
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
