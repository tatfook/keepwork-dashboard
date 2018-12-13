import { resourceCRUD } from '@/api/website'
import BaseResource from './base'
// import store from '@/store'

const crudAPI = resourceCRUD('websiteSuspends')

export default class WebsiteSuspend extends BaseResource {
  static api() {
    return crudAPI
  }
}
