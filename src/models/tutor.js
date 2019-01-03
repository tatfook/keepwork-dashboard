import { resourceCRUD as lessonCRUD } from '../api/lesson'
import _ from 'lodash'

const tutorCURD = lessonCRUD('tutors')

export default function tutorModel() {
  return {
    async list(params) {
      console.log(_)
      console.log(tutorCURD)

      const tutorList = tutorCURD.list(params)

      console.log(tutorList)

      return tutorList
    },
    async get() {
      return {}
    }
  }
}
