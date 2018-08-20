<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary">生成邀请码</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="Key">
        <template slot-scope="scope">
          {{scope.row.key}}
        </template>
      </el-table-column>
      <el-table-column label="State">
        <template slot-scope="scope">
          {{scope.row.state | statusFilter}}
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="生成邀请码" :visible.sync="dialogFormVisible">
      <el-input v-model="count" placeholder="Please input" style='width:400px;'></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTeacherCDKeys, generateTeacherCDKeys } from '@/api/lesson'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      tableKey: 0,
      total: null,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      downloadLoading: false,
      count: 10
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '待用',
        1: '已使用',
        2: '禁用'
      }
      return statusMap[status]
    }
  },
  async created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      const res = await getTeacherCDKeys()
      this.list = res.data
      this.listLoading = false
    },
    handleCreate() {
      this.dialogFormVisible = true
    },
    async createData() {
      this.downloadLoading = true
      const list = await generateTeacherCDKeys(this.count)
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['key']
        const filterVal = ['key']
        const data = this.formatJson(filterVal, list.data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth
        })
        this.downloadLoading = false
        this.dialogFormVisible = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
