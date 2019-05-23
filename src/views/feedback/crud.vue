<template>
  <div class="app-container">
    <!-- <div class="action-container">
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
    <crud-filter :searchParams="searchParams" @removeFilter="handleRemoveFilter" @handleSearch="handleSearch" /> -->
    <div class="feedback-filter">
      <el-form ref="feedbackFilter" :model="feedbackFilter" label-width="120px">
        <el-form-item label="举报人：" prop="username">
          <el-input v-model="feedbackFilter.username"></el-input>
        </el-form-item>
        <el-form-item label="举报网址：" prop="url">
          <el-input v-model="feedbackFilter.url"></el-input>
        </el-form-item>
        <el-form-item label="举报类型：" prop="type">
          <el-checkbox-group v-model="feedbackFilter.type">
            <el-checkbox label="1">假冒网站</el-checkbox>
            <el-checkbox label="2">传播病毒</el-checkbox>
            <el-checkbox label="3">反动</el-checkbox>
            <el-checkbox label="4">色情</el-checkbox>
            <el-checkbox label="5">暴力</el-checkbox>
            <el-checkbox label="0">其他</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="处理状态：" prop="state">
          <el-checkbox-group v-model="feedbackFilter.state">
            <el-checkbox label="1">已处理</el-checkbox>
            <el-checkbox label="0">未处理</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="处理方法：" prop="result">
          <el-checkbox-group v-model="feedbackFilter.result">
            <el-checkbox label="1">处理</el-checkbox>
            <el-checkbox label="2">误报</el-checkbox>
            <el-checkbox label="3">重复</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(feedbackFilterData)">搜 索</el-button>
          <el-button type="primary" @click="resetForm('feedbackFilter')">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <crud-table :listLoading="listLoading" :filter="colFilter" @handleAction="handleAction" @handleSort="handleSort" />

    <crud-paginate :listQuery="listQuery" :total="total" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />

    <el-dialog v-if="can('show')" :visible.sync="showingFormVisible">
      <crud-show :list="showingData" />
    </el-dialog>
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
  name: 'ComplaintCRUD',
  mixins: [crudMixin],
  data() {
    return {
      count: 10,
      feedbackFilter: {
        username: '',
        url: '',
        type: [],
        state: [],
        result: []
      }
    }
  },
  computed: {
    feedbackFilterData() {
      return {
        'username-like': this.feedbackFilter.username,
        'url-like': this.feedbackFilter.url,
        'type-in': this.feedbackFilter.type,
        'state-in': this.feedbackFilter.state,
        'result-in': this.feedbackFilter.result
      }
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
        const tHeader = this.resourceClass
          .exportAttrs()
          .map(item => this.i18n(item.name))
        const data = list.map(data =>
          this.resourceClass.exportAttrs().map(col => this.colFilter(col, data))
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
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.feedback-filter {
  width: 46%;
}
</style>

