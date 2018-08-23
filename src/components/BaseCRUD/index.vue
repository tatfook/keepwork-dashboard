<template>
  <div class="app-container">
    <!-- FIXME <div class="filter-container">
      <div v-for="attr in filters" :key="attr.key">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" v-model="listQuery"></el-input>
      </div>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div> -->
    <div class="content-container action-container">
      <el-button v-if="can('create')" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">新增</el-button>
      <el-button v-if="can('download')" class="filter-item" type="primary" icon="el-icon-download" :loading="downloadLoading" @click="handleDownload">导出</el-button>
    </div>

    <div class="content-container table-container">
      <el-table :data="list" v-loading="listLoading" element-loading-text="Loading..." border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" v-for="col in showableAttrs" :key="col.name" :label="col.name" :width="col.width">
          <template slot-scope="scope">
            <span> {{colFilter(col, scope.row[col.name])}} </span>
          </template>
        </el-table-column>

        <el-table-column align="center" :width="actionAreaWidth" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="can('show')" size="mini" @click="handleShow(scope.row)">查看</el-button>
            <el-button v-if="can('edit')" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-if="can('destroy')" type="warning" size="mini" @click="handleDelete(scope.row)">删除</el-button>
            <el-button v-for="op in extraActions" :key="op.name" @click="op.func(scope.row)" size="mini" :type="op.type">{{op.name}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="content-container pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery['x-page']" :page-sizes="[10,20,30, 50]" :page-size="listQuery['x-per-page']" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="attrRules" ref="dataForm" :model="temp" label-position="left" label-width="120px" style='width: 400px; margin-left:50px;'>
        <el-form-item v-for="attr in editableAttrs" :key="attr.name" :label="attr.name">
          <el-input v-if="attrType(attr, 'input')" v-model="temp['attr.name']"></el-input>
          <el-select v-else-if="attrType(attr, 'select')" v-model="temp['attr.name']">
            <el-option v-for="item in attr.options" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
          <el-date-picker v-else-if="attrType(attr, 'time')" v-model="temp['attr.name']" type="datetime"></el-date-picker>
          <el-rate v-else-if="attrType(attr, 'rate')" style="margin-top:8px;" v-model="temp['attr.name']" :colors="attr.colors" :max='attr.max'></el-rate>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
        <el-button v-else type="primary" @click="updateData">更新</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showingFormVisible">
      <el-table :data="showingData" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="属性">
          <template slot-scope="scope">
            <span> {{scope.row.key}} </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="值">
          <template slot-scope="scope">
            <span> {{scope.row.value}} </span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import _ from 'lodash'

/**
@props

@api: resouce api client
@attributes: resource attributes
  example:
  [
    {
      name: 'title',
      required: true,
      width: '100px',
      rules: [
        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change'}
      ],
      filter: (value) => {
        const statusMap = {
          0: '待用',
          1: '已使用',
          2: '禁用'
        }
        return statusMap[status]
      }
    }
  ]
 see rules doc in http://element-cn.eleme.io/#/zh-CN/component/form
@actions: resource action settings, including disabled and extra actions
 default actions are ['create', 'destroy', 'update', 'download']
 example:
  {
    disabled: ['destroy'],
    extra: [
      {
        name: 'publish',
        func: (row) => {alert(row.id)},
        type: 'normal'
      }
    ]
  }
 */
export default {
  name: 'BaseCRUD',
  props: {
    api: Object,
    attributes: {
      type: Array
    },
    actions: {
      type: Object,
      default: () => {
        return {
          disabled: [],
          extra: []
        }
      }
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
      temp: {},
      dialogFormVisible: false,
      showingFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      downloadLoading: false
    }
  },
  created() {
    this.resetTemp()
    this.getList()
  },
  methods: {
    can(action) {
      return !(
        this.actions.disabled && _.indexOf(this.actions.disabled, action) !== -1
      )
    },
    attrType(attr, type) {
      const attrType = attr.type || 'input'
      return attrType === type
    },
    colFilter(col, value) {
      return col.filter ? col.filter(value) : value
    },
    async getList() {
      this.listLoading = true
      const res = await this.api.list(this.listQuery)
      this.list = res.rows
      this.total = res.count
      this.listLoading = false
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
    resetTemp() {
      this.temp = { ...this.editableAttrs }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async createData() {
      const valid = this.$refs['dataForm'].validate()
      if (valid) {
        try {
          await this.api.create(this.temp)
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
      }
    },
    handleUpdate(row) {
      this.temp = { ...row }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async updateData() {
      const valid = await this.$refs['dataForm'].validate()
      if (valid) {
        const tempData = Object.assign({}, this.temp)
        try {
          await this.api.update(tempData)()
          for (const v of this.list) {
            if (v.id === tempData.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, tempData)
              break
            }
          }
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        } catch (err) {
          console.error(err)
        }
      }
    },
    async handleDelete(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.destroy(row).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleShow(row) {
      this.temp = { ...row }
      this.showingFormVisible = true
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.exportAttrs.map(item => item.name)
        const data = this.formatJson(this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(jsonData = []) {
      const filters = this.exportAttrs.map(item => item.name)
      return jsonData.map(v => filters.map(j => v[j]))
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
    editableAttrs() {
      return this.attrFilter('edit')
    },
    showableAttrs() {
      return this.attrFilter('show')
    },
    exportAttrs() {
      return this.attrFilter('export')
    },
    showingData() {
      if (!this.showingFormVisible) return []
      const data = []
      _.forEach(this.attributes, item => {
        data.push({ key: item.name, value: this.temp[item.name] })
      })
      return data
    },
    attrRules() {
      const rules = {}
      this.attributes.forEach(attr => {
        if (attr.required) {
          rules[attr.name] = [
            {
              required: true,
              message: attr.requiredMessage || `$attr.name is required`,
              trigger: attr.requiredTrigger || 'change'
            }
          ]
        }
        if (attr.rules) {
          rules[attr.name] = _.concat(rules[attr.name], attr.rules)
        }
      })
      return rules
    },
    extraActions() {
      return this.actions.extra || []
    },
    actionAreaWidth() {
      const defaultLength = ['show', 'edit', 'destroy'].length
      const disableLength = (this.actions.disabled || []).length
      const extraLength = (this.actions.extra || []).length
      const buttonWidth = 80
      return (defaultLength - disableLength + extraLength) * buttonWidth
    }
  }
}
</script>
