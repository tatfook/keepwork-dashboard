import createService from '@/utils/request'
const request = createService()

export function updateDownloadUrl(data) {
  return request({
    method: 'post',
    url: 'keepworks/paracraft_download_url',
    data
  })
}

export function getDownloadUrl() {
  return request({
    method: 'get',
    url: 'keepworks/paracraft_download_url'
  })
}

