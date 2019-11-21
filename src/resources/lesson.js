import lessonsModel from '@/models/lesson'
import { getUserToken } from '@/api/getToken'
import BaseResource from './base'
import _ from 'lodash'

const model = lessonsModel()

const KEEPWORK_PREFIX = process.env.KEEPWORK_PREFIX

const toPreview = async(row, that, type = '') => {
  const { userId, id } = row
  const token = await getUserToken(userId)
  if (token) {
    window.open(`${KEEPWORK_PREFIX}/l/preview/lesson/${id}${type ? `/${type}` : ''}?token=${token}`, '_blank')
  }
}
export default class Lesson extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        edit: false,
        width: '100px'
      },
      {
        name: 'lessonName',
        type: 'String',
        title: true,
        required: true
      },
      {
        name: 'username',
        type: 'String',
        search: false,
        edit: false
      },
      {
        name: 'userId',
        type: 'Number',
        associate: 'User',
        component: 'select',
        search: false,
        show: false,
        required: true
      },
      {
        name: 'subjectId',
        type: 'Number',
        required: true,
        component: 'select',
        associate: 'Subject',
        show: false
      },
      {
        name: 'subjectName',
        type: 'String',
        search: false,
        edit: false
      },
      {
        name: 'goals',
        type: 'String'
      },
      {
        name: 'coverUrl',
        type: 'String',
        search: false,
        show: false
      },
      {
        name: 'teacherVideoUrl',
        type: 'String',
        search: false,
        show: false
      },
      {
        name: 'studentVideoUrl',
        type: 'String',
        search: false,
        show: false
      },
      {
        name: 'createdAt',
        type: 'Date',
        edit: false
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['show'],
      extra: [
        {
          name: 'view',
          title(row) {
            const flag = _.get(row, 'url', '')
            return flag ? '教案' : false
          },
          async func(row, that) {
            toPreview(row, that)
          }
        },
        {
          name: 'courseware',
          title(row) {
            const flag = _.get(row, 'coursewareUrl', '')
            return flag ? '课件' : false
          },
          async func(row, that) {
            toPreview(row, that, 'courseware')
          }
        },
        {
          name: 'teacherVideo',
          title(row) {
            const flag = _.get(row, 'teacherVideoUrl', '')
            return flag ? '教师视频' : false
          },
          async func(row, that) {
            const teacherVideo = _.get(row, 'teacherVideoUrl', '')
            if (teacherVideo) {
              window.open(teacherVideo, '_blank')
            }
          }
        },
        {
          name: 'studentVideo',
          title(row) {
            const flag = _.get(row, 'studentVideoUrl', '')
            return flag ? '学生视频' : false
          },
          async func(row, that) {
            const studentVideo = _.get(row, 'studentVideoUrl', '')
            if (studentVideo) {
              window.open(studentVideo, '_blank')
            }
          }
        }
      ]
    }
  }
}
