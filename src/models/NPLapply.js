import createService from '@/utils/request'

const request = createService()

export default {
  list() {
    return request({
      method: 'get',
      url: 'games/members'
    })
  }
}
