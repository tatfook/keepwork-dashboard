<template>
  <div class="app-container">
    <!-- FIXME <div class="filter-container">
      <div v-for="attr in filters" :key="attr.key">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" v-model="listQuery"></el-input>
      </div>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div> -->
    <div class="action-container">
      <el-button v-if="can('create')" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">new</el-button>
      <el-button v-if="can('export')" class="filter-item" type="primary" icon="el-icon-download" :loading="downloadLoading" @click="handleExport">export</el-button>
    </div>

    <crud-table :listLoading="listLoading" :resourceClass="resourceClass" :list="list" :filter="colFilter" @handleAction="handleAction"> </crud-table>

    <crud-paginate :listQuery="listQuery" :total="total" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"> </crud-paginate>

    <el-dialog v-if="can('edit') || can('create')" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <crud-form :resourceClass="resourceClass" :formData="activeRow" :status="dialogStatus" @cancel="dialogFormVisible = false" @create="createData" @update="updateData">
      </crud-form>
    </el-dialog>

    <el-dialog :visible.sync="showingFormVisible">
      <crud-show :list="showingData"> </crud-show>
    </el-dialog>

  </div>
</template>

<script>
import crudMixin from './crud.mixin'
import CRUDTable from './table'
import CRUDForm from './form'
import CRUDShow from './show'
import CRUDPaginate from './paginate'

export default {
  name: 'BaseCRUD',
  mixins: [crudMixin],
  components: {
    'crud-table': CRUDTable,
    'crud-form': CRUDForm,
    'crud-show': CRUDShow,
    'crud-paginate': CRUDPaginate
  }
}
</script>
