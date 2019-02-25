import _ from 'lodash'
import { resourceCRUD } from '@/api/keepwork'

const gamesResourceCRUD = resourceCRUD('games')

export default {
  async list(data) {
    const nowTime = new Date()
    const list = await gamesResourceCRUD.list(data)
    const _rows = _.map(list.rows, i => {
      if (nowTime < new Date(i.startDate)) {
        i.state = 0
      } else if (nowTime > new Date(i.startDate) && nowTime < new Date(i.endDate)) {
        i.state = 1
      } else if (nowTime > new Date(i.endDate)) {
        i.state = 2
      }
      return i
    })
    return {
      count: list.count,
      rows: _rows
    }
  },
  update(data) {
    const nowTime = new Date()
    if (nowTime < new Date(data.startDate)) {
      data.state = 0
    } else if (nowTime > new Date(data.startDate) && nowTime < new Date(data.endDate)) {
      data.state = 1
    } else if (nowTime > new Date(data.endDate)) {
      data.state = 2
    }
    return gamesResourceCRUD.update(data)
  }
}
