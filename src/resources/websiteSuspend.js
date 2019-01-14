import websiteSuspendModel from '@/models/websiteSuspend'
import BaseResource from './base'

const model = websiteSuspendModel()

export default class websiteSuspend extends BaseResource {
  static attributes() {
    return [
      {
        name: 'sitename',
        originName: 'objectId',
        required: true,
        search: true,
        sort: false,
        formAssociate: 'sites',
        associate: 'illegalSites',
        associateAs: 'illegalSites',
        associateField: 'sitename'
      },
      {
        name: 'createdAt',
        type: 'Date',
        component: 'time',
        create: false,
        search: false
      },
      {
        name: 'description',
        type: 'String',
        required: true,
        component: 'text',
        sort: false,
        search: false
      },
      {
        name: 'handler',
        type: 'String',
        required: true,
        component: 'text',
        search: false,
        sort: false
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['show', 'edit', 'delete'],
      extra: [
        {
          name: 'resources.WebsiteSuspend.button.unblock',
          func: (ctx, data) => {
            ctx.$confirm(ctx.$t('resources.WebsiteSuspend.button.unblockMsg'), ctx.$t('resources.WebsiteSuspend.button.unblock'), {
              confirmButtonText: ctx.$t('ok'),
              cancelButtonText: ctx.$t('cancel'),
              type: 'warning'
            })
              .then(async() => {
                ctx.$notify({
                  title: ctx.$t('success'),
                  message: ctx.$t('unblockSelectedMsg.success'),
                  type: 'success',
                  duration: 2000
                })
                await this.model().destroy(data)
                ctx.getList()
              })
              .catch(err => {
                console.error(err)
                ctx.$message({
                  type: 'error',
                  message: ctx.$t('unblockSelectedMsg.failure')
                })
              })
          }
        }
      ]
    }
  }

  static action() {
    return {
      extra: [
        {
          name: 'unblockSelected',
          func: (ctx) => {
            if (ctx.selected.length === 0) {
              ctx.$message({
                type: 'error',
                message: ctx.$t('base.failed.empty')
              })
              return
            }
            ctx.$confirm(ctx.$t('unblockSelectedMsg.dialogMsg'), ctx.$t('unblockSelected'), {
              confirmButtonText: ctx.$t('ok'),
              cancelButtonText: ctx.$t('cancel'),
              type: 'warning'
            })
              .then(() => {
                this.model().destroyAll({ ids: ctx.selected.map(row => row.id) })
                  .then(() => {
                    ctx.$notify({
                      title: ctx.$t('success'),
                      message: ctx.$t('unblockSelectedMsg.success'),
                      type: 'success',
                      duration: 2000
                    })
                    ctx.getList()
                  })
              })
              .catch(err => {
                console.error(err)
                ctx.$message({
                  type: 'error',
                  message: ctx.$t('unblockSelectedMsg.failure')
                })
              })
          }
        }
      ]
    }
  }
}
