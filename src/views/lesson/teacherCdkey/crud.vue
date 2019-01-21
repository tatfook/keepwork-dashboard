<template>
  <div class="app-container">
    <div class="action-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleGenerate" type="primary">生成邀请码</el-button>

      <el-dropdown style="float: right" @command="handleAddFilter">
        <el-button type="primary">
          {{$t('addFilter')}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in searchableFilters" :key="item" :command="item">
            {{i18n(item)}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <crud-filter :searchParams="searchParams" @removeFilter="handleRemoveFilter" @handleSearch="handleSearch" />

    <crud-table :listLoading="listLoading" :filter="colFilter" @handleAction="handleAction" @handleSort="handleSort" />

    <crud-paginate :listQuery="listQuery" :total="total" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />

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
      const list = await this.resourceClass.model().generate(this.count)

      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.resourceClass.exportAttrs().map(item => this.i18n(item.name))
        const data = list.map(data =>
          this.resourceClass
            .exportAttrs()
            .map(col => this.colFilter(col, data))
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
