import { resourceCRUD } from '../api/keepwork'
// import _ from 'lodash'

const websiteSuspendCRUD = resourceCRUD('illegalSites')
// const illegalsCRUD = resourceCRUD('illegals')

export default function websiteSuspendModel() {
  return {
    async list(params) {
      // params['objectType-eq'] = 1
      const websiteSuspendParams = params

      const websiteSuspendList = await websiteSuspendCRUD.list(websiteSuspendParams)

      // const websitesIds = _.map(websitesList.rows, 'id')

      // const illegalsParams = { 'objectId-in': websitesIds, 'objectType-eq': 1 }
      // const illegalsList = await illegalsCRUD.list(illegalsParams)

      // const illegalsMap = new Map()

      // for (const item of illegalsList.rows) {
      //   illegalsMap.set(item.objectId, item)
      // }

      websiteSuspendList.rows.map(
        item => {
          // const curIllegal = illegalsMap.get(item.id)

          if (!item.displayName) {
            item.displayName = item.sitename
          }
        }
      )
      console.log(websiteSuspendList)
      return websiteSuspendList
    },
    async create(params) {
      return websiteSuspendCRUD.create(params)
    },
    async update(params) {
      return websiteSuspendCRUD.update(params)
    },
    async destroy(params) {
      return websiteSuspendCRUD.destroy(params)
    }
  }
}
