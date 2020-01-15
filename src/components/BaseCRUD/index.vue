<template>
  <div class="app-container">
    <div class="action-container">
      <el-button v-if="can('create')" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">{{$t('new')}}</el-button>
      <el-button v-if="can('export')" class="filter-item" type="primary" icon="el-icon-download" :loading="downloadLoading" @click="handleExport">{{$t('export')}}</el-button>
      <el-button v-if="can('delete')" class="filter-item" style="margin-left: 10px;" @click="handleDeleteAll" type="primary" icon="el-icon-plus">{{$t('deleteAll')}}</el-button>
      <!-- FIXME: 权限问题 -->
      <el-button v-for="button in appendButtons" :type="button.type" :key="button.name" @click="handleAppendButtonAction(button)">{{button.name}}</el-button>
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

    <el-dialog v-if="can('edit') || can('create')" :title="$t(textMap[dialogStatus])" width="60%" :visible.sync="dialogFormVisible">
      <crud-form v-if="dialogFormVisible" :formData="activeRow" :status="dialogStatus" @cancel="dialogFormVisible = false" @create="createData" @update="updateData" />
    </el-dialog>

    <el-dialog v-if="can('show')" :visible.sync="showingFormVisible">
      <crud-show :list="showingData" />
    </el-dialog>

    <el-dialog :visible.sync="dialogCheckboxVisible" :title="$t(textMap[dialogCheckboxStatus])">
      <crud-checkbox :list="checkboxData" :status="dialogCheckboxStatus" @cancel="dialogCheckboxVisible = false" @callback="handleCheckboxCallback"></crud-checkbox>
    </el-dialog>

    <el-dialog v-if="dialogInputVisible" :visible.sync="dialogInputVisible" :title="dialogTitle">
      <crud-input :list="inputData" :stats="dialogInputStatus" @cancel="dialogInputVisible = false" @callback="handleInputCallback"></crud-input>
    </el-dialog>

    <el-dialog v-if="dialogCustomVisible" :visible.sync="dialogCustomVisible" :title="dialogCustomTitle">
      <dialog-package-select :loading="dialogCustomLoading" v-if="dialogCustomType === 'packageSelect'" :stats="dialogCustomStatus" @cancel="dialogCustomVisible = false" @callback="handlePackageSelectCallback"></dialog-package-select>
    </el-dialog>

    <!-- 用户解绑 -->
    <el-dialog v-if="dialogUnbindVisible" :visible.sync="dialogUnbindVisible" :title="dialogTitle">
      <crud-unbind :list="inputData" :customRowData="customRowData" :stats="dialogUnbindStatus" @cancel="dialogUnbindVisible = false" @close="handleUnbindCallback" @callback="handleUnbindCallback"></crud-unbind>
    </el-dialog>

  </div>
</template>

<script>
import crudMixin from './crud.mixin'

export default {
  name: 'BaseCRUD',
  mixins: [crudMixin]
}
</script>
