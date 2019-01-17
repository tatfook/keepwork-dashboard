import { resourceCRUD } from '../api/keepwork'
const websitesCRUD = resourceCRUD('sites')
const groupsCRUD = resourceCRUD('groups')
const sitegroupsCRUD = resourceCRUD('siteGroups')
const membersCRUD = resourceCRUD('members')
const usersCRUD = resourceCRUD('users')
import _ from 'lodash'

export default function websiteManageModel() {
  return {
    async list(params) {
      const websitesList = await websitesCRUD.list(params)
      return websitesList
    },
    async checkAuthority(params) {
      const websitesList = await websitesCRUD.list(params)
      // const groupsList = await groupsCRUD.list(params)
      // console.log(groupsList)
      const sitegroupsList = await sitegroupsCRUD.list(params)
      // console.log(sitegroupsList)

      const groupIds = _.map(sitegroupsList.rows, 'groupId')
      const groups = await groupsCRUD.list({ 'id-in': groupIds }, 'search')
      const groupMap = new Map()
      for (const item of groups.rows) {
        groupMap.set(item.id, item)
      }
      sitegroupsList.rows.map(item => {
        const groupInfo = groupMap.get(item.groupId)
        if (groupInfo) {
          item.groupName = groupInfo.groupname
        }
      })

      // const membersParams = params
      // membersParams.where['objectType'] = 3
      // const membersList = await membersCRUD.list(membersParams)
      // console.log(membersList)
      // const groupIds = _.map(sitegroupsList.rows, 'groupId')
      const members = await membersCRUD.list({ 'objectId-in': groupIds }, 'search')

      let array = []
      array = members.rows.map((item, index, arrayB) => {
        const obj = arrayB.find(Item => item.objectId === Item.objectId)
        if (obj !== item) {
          obj.memberId.push(item.memberId)
          return undefined
        } else {
          obj.memberId = [obj.memberId]
          return obj
        }
      }).filter(item => item !== undefined)

      const memberMap = new Map()
      for (const item of array) {
        memberMap.set(item.objectId, item)
      }
      sitegroupsList.rows.map(item => {
        const groupIdInfo = memberMap.get(item.groupId)
        if (groupIdInfo) {
          item.memberArray = groupIdInfo.memberId
        }
        switch (item.level) {
          case 128:
            item.level = '拒绝'
            break
          case 32:
            item.level = '浏览'
            break
          case 64:
            item.level = '编辑'
            break
          default:
            break
        }
      })
      console.log(sitegroupsList)

      const userIds = _.map(sitegroupsList.rows, 'memberArray')
      const users = await usersCRUD.list({ 'id-in': userIds }, 'search')
      console.log('------')
      console.log(users)
      console.log('------')
      const userMap = new Map()
      for (const item of users.rows) {
        userMap.set(item.id, item)
      }

      sitegroupsList.rows.map(item => {
        item.memberNameArr = []
        if (item.memberArray) {
          _.forEach(item.memberArray, (memberItem, key) => {
            const userInfo = userMap.get(memberItem)
            if (userInfo) {
              item.memberNameArr[key] = userInfo.username
            } else {
              item.memberNameArr = []
            }
          })
        } else {
          item.memberNameArr = []
        }
      })

      console.log('++++')
      console.log(sitegroupsList)
      console.log('++++')

      const listArr = []
      sitegroupsList.rows.forEach((el) => {
        for (let i = 0; i < listArr.length; i++) {
          if (listArr[i].siteId === el.siteId) {
            listArr[i].listInfo.push({
              groupName: el.groupName,
              memberNameArr: el.memberNameArr,
              level: el.level
            })
            return
          }
        }
        listArr.push({
          siteId: el.siteId,
          listInfo: [{
            groupName: el.groupName,
            memberNameArr: el.memberNameArr,
            level: el.level
          }]
        })
      })

      // const ids = _.map(websitesList.rows, 'id')
      // const siteGroups = await sitegroupsCRUD.list({ 'siteId-in': ids }, 'search')
      // const siteGroupMap = new Map()
      // for (const item of siteGroups.rows) {
      //   siteGroupMap.set(item.siteId, item)
      // }

      // for (let k = 0; k < websitesList.rows.length; k++) {
      //   websitesList.rows[k].listInfo = []
      //   for (let j = 0; j < listArr.length; j++) {
      //     if (websitesList.rows[k].id === listArr[j].siteId) {
      //       websitesList.rows[k].listInfo = listArr[j].listInfo
      //       console.log(2)
      //     }
      //   }
      // }

      websitesList.rows.map(item => {
        item.listInfo = []
        _.forEach(listArr, (each, key) => {
          if (item.id === each.siteId) {
            item.listInfo = each.listInfo
          }
        })
        // if (!item.displayName) {
        //   item.displayName = item.sitename
        // }
        const base = 'https://keepwork.com/'
        item.siteUrl = base + item.username + '/' + item.sitename
      })
      console.log(websitesList)

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
