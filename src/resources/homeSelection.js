import homeSelectionModel from '@/models/homeSelection'
import BaseResource from './base'

const model = homeSelectionModel()

export default class HomeSelection extends BaseResource {
  static attributes() {
    return [
      {
        name: 'choicenessNo',
        type: 'Number',
        create: false,
        edit: false,
        sort: false,
        search: false
      },
      {
        name: 'id',
        type: 'Number',
        edit: false,
        sort: false,
        search: true
      },
      {
        name: 'name',
        type: 'String',
        create: false,
        edit: true,
        sort: false,
        search: true
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['create', 'show', 'edit', 'export', 'delete'],
      extra: [
        {
          name: 'resources.HomeSelection.button.del',
          button: 'info',
          func: (ctx, data) => {
            data.choicenessNo = 0
            ctx.getList()
            // ctx.$confirm(ctx.$t('resources.WebsiteSuspend.button.unblockMsg'), ctx.$t('resources.WebsiteSuspend.button.unblock'), {
            //   confirmButtonText: ctx.$t('ok'),
            //   cancelButtonText: ctx.$t('cancel'),
            //   type: 'warning'
            // })
            //   .then(async() => {
            //     ctx.$notify({
            //       title: ctx.$t('success'),
            //       message: ctx.$t('unblockSelectedMsg.success'),
            //       type: 'success',
            //       duration: 2000
            //     })
            //     await this.model().destroy(data)
            //     ctx.getList()
            //   })
            //   .catch(err => {
            //     console.error(err)
            //     ctx.$message({
            //       type: 'error',
            //       message: ctx.$t('unblockSelectedMsg.failure')
            //     })
            //   })
          }
        }
      ]
    }
  }

  static action() {
    return {
      extra: [
        {
          name: 'newSelection',
          func: (ctx) => {
            ctx.model().create()
            // if (ctx.selected.length === 0) {
            //   ctx.$message({
            //     type: 'error',
            //     message: ctx.$t('base.failed.empty')
            //   })
            //   return
            // }
            // ctx.$confirm(ctx.$t('unblockSelectedMsg.dialogMsg'), ctx.$t('unblockSelected'), {
            //   confirmButtonText: ctx.$t('ok'),
            //   cancelButtonText: ctx.$t('cancel'),
            //   type: 'warning'
            // })
            //   .then(() => {
            //     this.model().destroyAll({ ids: ctx.selected.map(row => row.id) })
            //       .then(() => {
            //         ctx.$notify({
            //           title: ctx.$t('success'),
            //           message: ctx.$t('unblockSelectedMsg.success'),
            //           type: 'success',
            //           duration: 2000
            //         })
            //         ctx.getList()
            //       })
            //   })
            //   .catch(err => {
            //     console.error(err)
            //     ctx.$message({
            //       type: 'error',
            //       message: ctx.$t('unblockSelectedMsg.failure')
            //     })
            //   })
          }
        }
      ]
    }
  }
}
