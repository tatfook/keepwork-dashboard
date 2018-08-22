import createService from '@/utils/request'

const request = createService(process.env.LESSON_API)

// teacher cdkeys
// FIXME missing query
export function getTeacherCDKeys(query) {
  return request({
    url: '/admins/teacherCDKeys',
    method: 'get',
    params: query
  })
}

export function generateTeacherCDKeys(count) {
  return request({
    url: '/admins/teacherCDKeys/generate',
    method: 'post',
    params: { count }
  })
}
