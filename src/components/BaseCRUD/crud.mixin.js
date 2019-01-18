import _ from 'lodash'
import moment from 'moment'
import { QUERY, FORMAT } from './config'
import { newResource, getResourceClass } from '@/resources'
import { rolesCan } from '@/utils/cancan'
import { mapGetters, mapActions } from 'vuex'
import CRUDTable from './table'
import CRUDForm from './form'
import CRUDShow from './show'
import CRUDPaginate from './paginate'
import CRUDFilter from './filter'
import { ActiveQuery } from '@/utils/query'

const DEFAULT_ACTIONS = ['create', 'show', 'edit', 'delete', 'export']

export default {
  props: {
    resource: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      listLoading: true,
      listQuery: {
        [QUERY.page]: 1,
        [QUERY.perPage]: 20,
        [QUERY.order]: ''
      },
      listFilter: {},
      dialogFormVisible: false,
      showingFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'edit',
        create: 'create'
      },
      downloadLoading: false,
      searchParams: []
    }
  },
  async created() {
    await this.setResourceName({ resourceName: this.resource })
    await this.getList()

    this.model = this.resourceClass.model()
  },
  methods: {
    ...mapActions({
      setResourceName: 'setResourceName',
      setActiveResource: 'setActiveResource',
      setQueryOptions: 'setQueryOptions'
    }),
    i18n(col) {
      return this.resourceClass.i18n(col)
    },
    can(action) {
      if (this.actions.disabled && _.indexOf(this.actions.disabled, action) === -1) {
        return rolesCan(this.roles, action, this.resourceClass)
      }
    },
    async getList() {
      this.listLoading = true
      const query = this.resourceClass.queryFilter(new ActiveQuery())
      const queryOptions = query.where(this.listFilter).paginate(this.listQuery[QUERY.page], this.listQuery[QUERY.perPage]).order(this.listQuery[QUERY.order]).query
      await this.setQueryOptions({ queryOptions })

      this.listLoading = false
    },
    colFilter(col, row) {
      let value = _.get(row, col.name)

      if (value == null || value === undefined) {
        value = _.get(row, col.originName)
      }

      if (value === null || value === undefined) return ''
      if (col.filter) return col.filter(value)
      if (!row[col.name] && col.associate) {
        const item = _.get(row, col.associateAs || col.associate)
        return (item && item[col.name]) || ''
      }
      if (col.type === 'Date') {
        return moment(value).format(FORMAT.date)
      }
      return value
    },
    getNestedAttr(name) {
      for (const item of this.nested) {
        if (item.name === name) return getResourceClass(item.associate).title()
      }
    },
    handleActions(action, row) {
      if (_.indexOf(DEFAULT_ACTIONS, action) !== -1) {
        return this[`handle${_.capitalize(action)}`](row)
      } else {
        const index = _.findIndex(this.actions.extra, {
          name: action
        })
        if (index !== -1) {
          const func = this.actions.extra[index].func || this[`handle${_.capitalize(action)}`]
          if (!func) throw new Error('Missing action' + action)
          return func(this, row)
        }
      }
    },
    handleAction(op) {
      if (op && op.func) {
        op.func(this)
      }
    },
    handleFilter() {
      this.listQuery[QUERY.page] = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery[QUERY.perPage] = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery[QUERY.page] = val
      this.getList()
    },
    async handleCreate() {
      this.setActiveResource({})
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    async handleEdit(row) {
      const resource = this.list[this.list.findIndex(item => item.id === row.id)]
      this.setActiveResource({ resource })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    async handleShow(row) {
      const resource = this.list[this.list.findIndex(item => item.id === row.id)]
      this.setActiveResource({ resource })
      this.showingFormVisible = true
    },
    handleExport() {
      if (this.selected.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('base.failed.empty')
        })
        return
      }
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.resourceClass.exportAttrs().map(item => this.i18n(item.name))
        const data = this.selected.map(data =>
          this.resourceClass.exportAttrs().map(col => this.colFilter(col, data))
        )

        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    async createData(data) {
      try {
        await this.model.create(data)
        this.dialogFormVisible = false
        this.handleCurrentChange(1)
        this.$notify({
          title: this.$t('success'),
          message: this.$t('base.success.create'),
          type: 'success',
          duration: 2000
        })
      } catch (err) {
        console.error(err)
      }
    },
    async updateData(data) {
      let temp = newResource(this.resource, data)
      try {
        temp = await this.model.update(temp)
        for (const v of this.list) {
          if (v.id === temp.id) {
            const index = this.list.indexOf(v)
            this.list.splice(index, 1, temp)
            break
          }
        }
        this.dialogFormVisible = false
        this.$notify({
          title: this.$t('success'),
          message: this.$t('base.success.update'),
          type: 'success',
          duration: 2000
        })
        this.getList()
      } catch (err) {
        console.error(err)
      }
    },
    async handleDelete(row) {
      this.$confirm(this.$t('base.confirm.delete'), this.$t('delete'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          this.model
            .destroy(row)
            .then(() => {
              this.$notify({
                title: this.$t('success'),
                message: this.$t('base.success.delete'),
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
            .catch(err => {
              console.error(err)
              this.$message({
                type: 'error',
                message: this.$t('base.failed.delete')
              })
            })
        })
        .catch(err => {
          console.error(err)
          this.$message({
            type: 'error',
            message: this.$t('base.failed.delete')
          })
        })
    },
    handleDeleteAll() {
      if (this.selected.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('base.failed.empty')
        })
        return
      }
      this.$confirm(this.$t('base.confirm.deleteList'), this.$t('delete'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          this.model
            .destroyAll({
              ids: this.selected.map(row => row.id)
            })
            .then(() => {
              this.$notify({
                title: this.$t('success'),
                message: this.$t('base.success.delete'),
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: this.$t('base.failed.delete')
          })
        })
    },
    handleSort(column, order) {
      this.listQuery[QUERY.order] = column + '-' + order
      this.getList()
    },
    handleAddFilter(filter) {
      if (_.indexOf(this.searchParams, filter) === -1) {
        this.searchParams.push(filter)
      }
    },
    handleRemoveFilter(filter) {
      const index = _.indexOf(this.searchParams, filter)
      if (index !== -1) this.searchParams.splice(index, 1)
    },
    handleSearch(q) {
      this.listFilter = q
      this.getList()
    }
  },
  computed: {
    ...mapGetters({
      roles: 'roles',
      nested: 'nested',
      nestedData: 'nestedData',
      list: 'resourceList',
      activeRow: 'activeResource',
      selected: 'selectedResources',
      resourceName: 'resourceName',
      resourceClass: 'resourceClass',
      total: 'total',
      attributes: 'attributes',
      actions: 'actions'
    }),
    showingData() {
      if (!this.showingFormVisible) return []
      const data = []
      _.forEach(this.attributes, item => {
        data.push({
          key: item.name,
          value: this.activeRow[item.name]
        })
      })
      return data
    },
    searchableFilters() {
      if (this.resourceClass) {
        return this.resourceClass.searchAttrs().map(attr => attr.name)
      } else {
        return []
      }
    },
    canAction() {
      return this.resourceClass.action().extra || []
    }
  },
  components: {
    'crud-table': CRUDTable,
    'crud-form': CRUDForm,
    'crud-show': CRUDShow,
    'crud-paginate': CRUDPaginate,
    'crud-filter': CRUDFilter
  }
}
