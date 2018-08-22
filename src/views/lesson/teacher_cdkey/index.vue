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

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

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
        per_page: 20
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
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const res = await getTeacherCDKeys(this.listQuery)
      this.list = res.rows
      this.total = res.count
      this.listLoading = false
    },
    handleSizeChange(val) {
      this.listQuery.per_page = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate() {
      this.dialogFormVisible = true
    },
    async createData() {
      this.downloadLoading = true
      const list = await generateTeacherCDKeys(this.count)
      debugger
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['key']
        const filterVal = ['key']
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth
        })
        this.downloadLoading = false
        this.dialogFormVisible = false
        this.handleCurrentChange(1)
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
