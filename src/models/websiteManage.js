import { resourceCRUD } from '../api/keepwork'
// import _ from 'lodash'

const websitesCRUD = resourceCRUD('sites')
const siteGroupsCRUD = resourceCRUD('siteGroups')
const websiteSuspendCRUD = resourceCRUD('illegals')
// const datasCRUD = resourceCRUD('datas') // 没数据
// const domainsCRUD = resourceCRUD('domains') // 没数据
// const filesCRUD = resourceCRUD('files') // 文件
// const membersCRUD = resourceCRUD('members') // 成员
// const mytableCRUD = resourceCRUD('mytable') // 400报错
// const mytablesCRUD = resourceCRUD('mytables') // 400报错
const oauthUsersCRUD = resourceCRUD('oauthUsers')
// const ordersCRUD = resourceCRUD('orders') // 订单
// const pagesCRUD = resourceCRUD('pages')
// const rolesCRUD = resourceCRUD('roles') // 没数据
// const storagesCRUD = resourceCRUD('storages') // 网盘
// const userRanksCRUD = resourceCRUD('userRanks') // 个人主页
const usersCRUD = resourceCRUD('users')

export default function websiteManageModel() {
  return {
    async list(params) {
      const websitesParams = params

      const websitesList = await websitesCRUD.list(websitesParams)

      //
      const siteGroupsList = await siteGroupsCRUD.list(websitesParams)
      console.log(siteGroupsList)
      const websiteSuspendList = await websiteSuspendCRUD.list(websitesParams)
      console.log(websiteSuspendList)
      // const datasList = await datasCRUD.list(websitesParams)
      // console.log(datasList)
      // const domainsList = await domainsCRUD.list(websitesParams)
      // console.log(domainsList)
      // const filesList = await filesCRUD.list(websitesParams)
      // console.log(filesList)
      // const membersList = await membersCRUD.list(websitesParams)
      // console.log(membersList)
      // const mytableList = await mytableCRUD.list(websitesParams)
      // console.log(mytableList)
      // const mytablesList = await mytablesCRUD.list(websitesParams)
      // console.log(mytablesList)
      const oauthUsersList = await oauthUsersCRUD.list(websitesParams)
      console.log(oauthUsersList)
      // const ordersList = await ordersCRUD.list(websitesParams)
      // console.log(ordersList)
      // const pagesList = await pagesCRUD.list(websitesParams)
      // console.log(pagesList)
      // const rolesList = await rolesCRUD.list(websitesParams)
      // console.log(rolesList)
      // const storagesList = await storagesCRUD.list(websitesParams)
      // console.log(storagesList)
      // const userRanksList = await userRanksCRUD.list(websitesParams)
      // console.log(userRanksList)
      const usersList = await usersCRUD.list(websitesParams)
      console.log(usersList)

      // const websitesIds = _.map(websitesList.rows, 'id')

      // const illegalsParams = { 'objectId-in': websitesIds, 'objectType-eq': 1 }
      // const illegalsList = await illegalsCRUD.list(illegalsParams)

      // const illegalsMap = new Map()

      // for (const item of illegalsList.rows) {
      //   illegalsMap.set(item.objectId, item)
      // }

      websitesList.rows.map(
        item => {
          // const curIllegal = illegalsMap.get(item.id)

          if (!item.displayName) {
            item.displayName = item.sitename
          }
        }
      )
      console.log(websitesList)

      // const usersIds = _.map(websitesList.rows, 'userId')
      // let blockedUserList
      // try {
      //   blockedUserList = await websiteSuspendCRUD.list({ 'userId-in': usersIds })
      // } catch (error) {
      //   console.log(error)
      // }
      // console.log(blockedUserList)
      // const blockedUserMap = new Map()
      // for (const item of blockedUserList.rows) {
      //   blockedUserMap.set(item.userId, item)
      // }

      // websitesList.rows.map(
      //   item => {
      //     const curWebsite = blockedUserMap.get(item.userId)
      //     console.log(curWebsite)

      //     item.username = curWebsite.username || ''
      //   }
      // )
      // console.log(websitesList)

      return websitesList
    },
    async create(params) {
      return websitesCRUD.create(params)
    },
    async update(params) {
      if (params === 'displayName') {
        console.log(123)
        // params['displayName'] = params['sitename']
      }
      return websitesCRUD.update(params)
    },
    async destroy(params) {
      return websitesCRUD.destroy(params)
    }
  }
}
