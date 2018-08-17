import createService from '@/utils/request'

const request = createService(process.env.LESSON_API)

// teacher cdkeys
export function getTeacherCDKeys() {
  return request({
    url: '/admin/teacher_cdkeys',
    method: 'get'
  })
}

export function generateTeacherCDKeys(count) {
  return request({
    url: '/admin/teacher_cdkeys/generate',
    method: 'post',
    params: { count }
  })
}
