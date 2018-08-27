import _ from 'lodash'
import { newResource, getResourceClass } from '@/resources'
import { rolesCan } from '@/utils/cancan'
import { mapGetters } from 'vuex'

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
        'x-per-page': 20
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
      nestedData: {}
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
      this.listLoading = false
    },
    colFilter(col, value) {
      if (value === null || value === undefined) return ''
      if (col.filter) return col.filter(value)
      if (this.nestedData[col.name]) {
        const item = this.nestedData[col.name][value]
        const translate = (item && item[this.getNestedAttr(col.name)]) || ''
        return value + '-' + translate
      }
      return value
    },
    initNestedData() {
      for (const nestedItem of this.nested) {
        const data = nestedItem.data || {}
        this.nestedData[nestedItem.name] = data
      }
    },
    getNestedAttr(name) {
      for (const nestedItem of this.nested) {
        if (nestedItem.name === name) return getResourceClass(nestedItem.associate).title()
      }
    },
    async getNestedData() {
      for (const nestedItem of this.nested) {
        const nestedResource = getResourceClass(nestedItem.associate)
        const key = nestedItem.name
        const idList = _(this.list)
          .map(item => item.data[key])
          .compact()
          .uniq()
        // FIXME, should only call once
        for (const id of idList) {
          const data = this.nestedData[key]
          if (!data[id]) data[id] = await nestedResource.api().get(id)
        }
      }
    },
    handleAction(action, row) {
      if (_.indexOf(DEFAULT_ACTIONS, action) !== -1) {
        return this[`handle${_.capitalize(action)}`](row)
      } else {
        const index = _.findIndex(this.actions.extra, { name: action })
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
      this.activeRow = { ...row }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleShow(row) {
      this.activeRow = { ...row }
      this.showingFormVisible = true
    },
    handleExport() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.exportAttrs.map(item => item.name)
        const data = this.list.map(data =>
          this.exportAttrs.map(col => this.colFilter(col, data[col.name]))
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
          title: '成功',
          message: '创建成功',
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
        await this.api.update(temp.data)
        for (const v of this.list) {
          if (v.data.id === temp.data.id) {
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
      })
        .then(() => {
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    attrFilter(key) {
      const attrs = []
      this.attributes.forEach(attr => {
        if (attr[key] !== false) {
          attrs.push(attr)
        }
      })
      return attrs
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
        data.push({ key: item.name, value: this.temp[item.name] })
      })
      return data
    }
  }
}
