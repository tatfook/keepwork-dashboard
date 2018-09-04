import _ from 'lodash'
import md5 from 'blueimp-md5'
import moment from 'moment'
import {
  newResource,
  getResourceClass
} from '@/resources'
import {
  rolesCan
} from '@/utils/cancan'
import {
  mapGetters
} from 'vuex'
import CRUDTable from './table'
import CRUDForm from './form'
import CRUDShow from './show'
import CRUDPaginate from './paginate'
import CRUDFilter from './filter'

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
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        'x-page': 1,
        'x-per-page': 20,
        'x-order': ''
      },
      activeRow: {},
      dialogFormVisible: false,
      showingFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      downloadLoading: false,
      nestedData: {},
      nestedKey: undefined,
      searchParams: []
    }
  },
  created() {
    this.loadResource()
    this.initNestedData()
    this.getList()
  },
  methods: {
    loadResource() {
      this.resourceClass = getResourceClass(this.resource)
      this.api = this.resourceClass.api()
      this.attributes = this.resourceClass.attributes()
      this.actions = this.resourceClass.actions()
      this.nested = this.resourceClass.nested()
    },
    can(action) {
      if (this.actions.disabled && _.indexOf(this.actions.disabled, action) === -1) {
        return rolesCan(this.roles, action, this.resourceClass)
      }
    },
    async getList() {
      this.listLoading = true
      const res = await this.api.list(this.listQuery)
      this.list = res.rows.map(row => newResource(this.resource, row))
      this.total = res.count
      await this.getNestedData()
      this.nestedKey = md5(this.nestedData)
      this.listLoading = false
    },
    colFilter(col, value) {
      if (value === null || value === undefined) return ''
      if (col.filter) return col.filter(value)
      if (this.nestedData[col.name]) {
        const item = this.nestedData[col.name][value]
        return (item && item[this.getNestedAttr(col.name)]) || ''
      }
      if (col.type === 'Date') {
        return moment(value).format('YYYY-MM-DD HH:mm')
      }
      return value
    },
    initNestedData() {
      for (const item of this.nested) {
        this.nestedData[item.name] = {}
      }
    },
    getNestedAttr(name) {
      for (const item of this.nested) {
        if (item.name === name) return getResourceClass(item.associate).title()
      }
    },
    async getNestedData() {
      for (const item of this.nested) {
        const nestedResource = getResourceClass(item.associate)
        const key = item.name
        const idList = _(this.list)
          .map(item => item[key])
          .compact()
          .uniq()
        const list = await nestedResource.api().list({
          id: idList
        })
        for (const item of list.rows) {
          _.merge(this.nestedData[key], {
            [item.id]: item
          })
        }
      }
    },
    handleAction(action, row) {
      if (_.indexOf(DEFAULT_ACTIONS, action) !== -1) {
        return this[`handle${_.capitalize(action)}`](row)
      } else {
        const index = _.findIndex(this.actions.extra, {
          name: action
        })
        if (index !== -1) {
          const func = this.actions.extra[index].func || this[`handle${_.capitalize(action)}`]
          if (!func) throw new Error('Missing action' + action)
          return func(row)
        }
      }
    },
    handleFilter() {
      this.listQuery['x-page'] = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery['x-per-page'] = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery['x-page'] = val
      this.getList()
    },
    handleCreate() {
      this.activeRow = null
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      this.activeRow = { ...row
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleShow(row) {
      this.activeRow = { ...row
      }
      this.showingFormVisible = true
    },
    handleExport() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.resourceClass.exportAttrs().map(item => item.name)
        const data = this.list.map(data =>
          this.resourceClass.exportAttrs().map(col => this.colFilter(col, data[col.name]))
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
        await this.api.create(data)
        this.dialogFormVisible = false
        this.handleCurrentChange(1)
        this.$notify({
          title: 'Success',
          message: 'Created successfully!',
          type: 'success',
          duration: 2000
        })
      } catch (err) {
        console.error(err)
      }
    },
    async updateData(data) {
      const temp = newResource(this.resource, data)
      try {
        await this.api.update(temp)
        for (const v of this.list) {
          if (v.id === temp.id) {
            const index = this.list.indexOf(v)
            this.list.splice(index, 1, temp)
            break
          }
        }
        this.dialogFormVisible = false
        this.$notify({
          title: 'success',
          message: 'Updated successfully!',
          type: 'success',
          duration: 2000
        })
      } catch (err) {
        console.error(err)
      }
    },
    async handleDelete(row) {
      this.$confirm('Are you sure?', 'Delete', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.api
          .destroy(row)
          .then(() => {
            this.$notify({
              title: 'success',
              message: 'Deleted successfully!',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
          .catch(err => {
            console.log(err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Cancel Delete!'
        })
      })
    },
    handleSort(column, order) {
      this.listQuery['x-order'] = column + '-' + order
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
      this.listQuery = _.pickBy(this.listQuery, (value, key) => {
        return _.startsWith(key, 'x-')
      })
      _.merge(this.listQuery, q)
      this.getList()
    }
  },
  computed: {
    ...mapGetters({
      roles: 'roles'
    }),
    showingData() {
      if (!this.showingFormVisible) return []
      const data = []
      _.forEach(this.attributes, item => {
        data.push({
          key: item.name,
          value: this.temp[item.name]
        })
      })
      return data
    },
    searchableFilters() {
      return this.resourceClass.searchAttrs().map(attr => attr.name)
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
