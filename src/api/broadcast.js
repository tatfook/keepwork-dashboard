import createService from '@/utils/request'
const ENV = process.env.NODE_ENV

let socket_api = 'https://socket.keepwork.com/api/v0/app/'

if (ENV === 'development') {
  socket_api = 'https://socket-stage.keepwork.com/api/v0/app/'
}

if (ENV === 'stage' || ENV === 'release') {
  socket_api = `https://socket-${ENV}.keepwork.com/api/v0/app/`
}

const request = createService(socket_api)

export function broadcast(data) {
  return request({
    method: 'post',
    url: 'broadcast',
    data
  })
}

export function msg(data) {
  return request({
    method: 'post',
    url: 'msg',
    data
  })
}