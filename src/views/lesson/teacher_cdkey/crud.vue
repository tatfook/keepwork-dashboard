<template>
  <div class="app-container">
    <div class="action-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleGenerate" type="primary">Generate Code</el-button>
    </div>

    <crud-table :key="nestedKey" :listLoading="listLoading" :resourceClass="resourceClass" :list="list" :filter="colFilter" @handleAction="handleAction" @handleSort="handleSort"> </crud-table>

    <crud-paginate :listQuery="listQuery" :total="total" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"> </crud-paginate>

    <el-dialog title="Code Generator" :visible.sync="dialogFormVisible">
      <el-input v-model="count" placeholder="Please input" style='width:400px;'></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">cancel</el-button>
        <el-button type="primary" @click="generateData">OK</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import crudMixin from '@/components/BaseCRUD/crud.mixin'

export default {
  name: 'TeacherCDKeyCRUD',
  mixins: [crudMixin],
  data() {
    return {
      count: 10
    }
  },
  methods: {
    handleGenerate() {
      this.dialogFormVisible = true
    },
    async generateData() {
      this.downloadLoading = true
      const list = await this.resourceClass.api().generate(this.count)
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.resourceClass.exportAttrs().map(item => item.name)
        const data = list.map(data =>
          this.resourceClass.exportAttrs().map(col => this.colFilter(col, data[col.name]))
        )
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
        this.dialogFormVisible = false
        this.getList()
      })
    }
  }
}
</script>
