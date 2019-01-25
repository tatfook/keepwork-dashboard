<template>
  <div class="app-container">
    <div class="action-container">
      <el-button v-if="can('create')" class="filter-item" @click="handleCreate" type="primary" icon="el-icon-plus">{{$t('new')}}</el-button>
      <el-button v-if="can('export')" class="filter-item" type="primary" icon="el-icon-download" :loading="downloadLoading" @click="handleExport">{{$t('export')}}</el-button>
      <el-button v-if="can('delete')" class="filter-item" style="margin-left: 10px;" @click="handleDeleteAll" type="primary" icon="el-icon-plus">{{$t('deleteAll')}}</el-button>
      <el-button v-for="op in canAction" :key="op.name" class="filter-item" style="margin-left: 10px;" @click="handleAction(op)" type="primary" icon="el-icon-plus">{{$t(op.name)}}</el-button>

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

    <crud-table :listLoading="listLoading" :filter="colFilter" @handleActions="handleActions" @handleSort="handleSort" />

    <crud-paginate :listQuery="listQuery" :total="total" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />

    <el-dialog v-if="can('edit') || can('create')" :title="$t(textMap[dialogStatus])" :visible.sync="dialogFormVisible">
      <crud-form :formData="activeRow" :status="dialogStatus" @cancel="dialogFormVisible = false" @create="createData" @update="updateData" />
    </el-dialog>

    <el-dialog :visible.sync="isShowCommentdialog" width="800px">
      <template>
        <el-table style="width: 100%" max-height="500" :data="commentsList">
          <el-table-column fixed label="用户" width="150" prop="commentsUserName"></el-table-column>
          <el-table-column label="评论" width="800" prop="content"></el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
             <el-button type="warning" size="mini" @click="commentDelete(scope.row)">{{$t('delete')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>

    <el-dialog v-if="can('show')" :visible.sync="showingFormVisible">
      <crud-show :list="showingData" />
    </el-dialog>

  </div>
</template>

<script>
import crudMixin from '../../../components/BaseCRUD/crud.mixin'

export default {
  name: 'BaseCRUD',
  mixins: [crudMixin],
  props: {},
  data() {
    return {
      isShowCommentdialog: false,
      commentsData: []
    }
  },
  computed: {
    commentsList() {
      return this.commentsData
    }
  },
  methods: {
    async commentDelete(row, done) {
      await this.model.commentsDestroy(row)
      this.commentsData = await this.model.comments(this.issueId)
    }
  }
}
</script>
