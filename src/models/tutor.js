import { resourceCRUD as lessonCRUD } from '../api/lesson'
import { resourceCRUD as keepworkCRUD } from '../api/keepwork'
import _ from 'lodash'

const tutorCRUD = lessonCRUD('tutor')
const usersCRUD = keepworkCRUD('users')

const coverCondition = (field, condition) => {
  return `${field}-${condition.match(/\$(.+)/)[1]}`
}

export default function tutorModel() {
  return {
    async list(params) {
      for (const index in params.include) {
        const item = params.include[index]
        if (item.where && item.where['studentName']) {
          const studentObject = item.where['studentName']
          let condition = ''
          let value = ''

          for (const key in studentObject) {
            condition = coverCondition('username', key)
            value = studentObject[key]
          }
          const searchStudents = await usersCRUD.list({ [condition]: value }, 'search')

          const searchStudentIds = _.map(searchStudents.rows, 'id')

          delete params.where.studentName

          params.where.userId = {
            '$in': searchStudentIds
          }

          _.pullAt(params.include, index)
        }
      }

      if (params.where.cellphone) {
        const cellphoneObject = params.where.cellphone
        let condition = ''
        let value = ''

        for (const key in cellphoneObject) {
          condition = coverCondition('cellphone', key)
          value = cellphoneObject[key]
        }

        const searchCellphones = await usersCRUD.list({ [condition]: value }, 'search')

        const searchCellphoneIds = _.map(searchCellphones.rows, 'id')

        delete params.where.cellphone

        params.where.userId = _.merge(params.where.userId || {}, {
          '$in': searchCellphoneIds
        })
      }

      if (params.where.status) {
        const statusObject = params.where.status
        let value = ''

        for (const key in statusObject) {
          value = statusObject[key]
        }

        if (value === '正常') {
          params.where.endTime = {
            '$gte': Date.now()
          }
        } else {
          params.where.endTime = {
            '$lt': Date.now()
          }
        }

        delete params.where.status
      }

      const tutorList = await tutorCRUD.list(params)

      if (!tutorList || !tutorList.count || !tutorList.rows) {
        return { count: 0, rows: [] }
      }

      const studentIds = _.map(tutorList.rows, 'userId')

      const students = await usersCRUD.list({ 'id-in': studentIds }, 'search')
      const studentsMap = new Map()

      for (const item of students.rows) {
        studentsMap.set(item.id, item)
      }

      const teacherIds = _.map(tutorList.rows, 'tutorId')

      const tutors = await usersCRUD.list({ 'id-in': teacherIds }, 'search')
      const tutorsMap = new Map()

      for (const item of tutors.rows) {
        tutorsMap.set(item.id, item)
      }

      for (const item of tutorList.rows) {
        if (item.extra && item.extra.tutor) {
          item.comment = item.extra.tutor
        }

        if (item.endTime > Date.now()) {
          item.status = '正常'
        } else {
          item.status = '已到期'
        }

        const curStudent = studentsMap.get(item.userId)

        if (curStudent) {
          item.studentName = curStudent.username
          item.cellphone = curStudent.cellphone || curStudent.realname
        }

        const curTutor = tutorsMap.get(item.tutorId)

        if (curTutor) {
          item.teacherName = curTutor.username
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
        tutor: params.comment || ''
      }

      return tutorCRUD.create(createParams)
    },
    async update(params) {
      const updateParams = {}

      updateParams.id = params.id
      updateParams.tutorId = params.tutorId
      updateParams.endTime = new Date(params.endTime).getTime()
      updateParams.extra = {
        tutor: params.comment || ''
      }

      return tutorCRUD.update(updateParams)
    },
    async destroy(params) {
      return tutorCRUD.destroy(params)
    },
    async destroyAll(params) {
      for (const index of params.ids || []) {
        await this.destroy({ id: index })
      }
    }
  }
}
