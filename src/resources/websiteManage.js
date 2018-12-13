import { resourceCRUD } from '@/api/website'
import BaseResource from './base'
// import store from '@/store'

const crudAPI = resourceCRUD('websiteManages')

export default class WebsiteManage extends BaseResource {
  static api() {
    return crudAPI
  }
}
