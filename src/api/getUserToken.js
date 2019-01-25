import createService from '@/utils/request'

const request = createService()

export function getUserToken(userId) {
  const base = '/admins/userToken?userId='
  return request({
    method: 'get',
    url: base + userId
  })
}
