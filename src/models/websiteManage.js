import { resourceCRUD } from '../api/keepwork'
const websitesCRUD = resourceCRUD('sites')
const groupsCRUD = resourceCRUD('groups')
const sitegroupsCRUD = resourceCRUD('siteGroups')
const membersCRUD = resourceCRUD('members')
// import _ from 'lodash'

export default function websiteManageModel() {
  return {
    async list(params) {
      const websitesParams = params

      const websitesList = await websitesCRUD.list(websitesParams)

      const groupsList = await groupsCRUD.list(websitesParams)
      console.log(groupsList)
      const sitegroupsList = await sitegroupsCRUD.list(websitesParams)
      console.log(sitegroupsList)
      const membersList = await membersCRUD.list(websitesParams)
      console.log(membersList)

      return websitesList
    },
    async create(params) {
      return websitesCRUD.create(params)
    },
    async update(params) {
      return websitesCRUD.update(params)
    },
    async destroy(params) {
      return websitesCRUD.destroy(params)
    },
    async destroyAll(params) {
      for (const index of params.ids || []) {
        await this.destroy({ id: index })
      }
    }
  }
}
