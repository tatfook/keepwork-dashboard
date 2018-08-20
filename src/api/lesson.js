import createService from '@/utils/request'

const request = createService(process.env.LESSON_API)

// teacher cdkeys
export function getTeacherCDKeys() {
  return request({
    url: '/admin/teacherCDKeys',
    method: 'get'
  })
}

export function generateTeacherCDKeys(count) {
  return request({
    url: '/admin/teacherCDKeys/generate',
    method: 'post',
    params: { count }
  })
}
