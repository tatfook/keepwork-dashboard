<template>
  <div class="app-container">
    <div class="action-container">
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

    <el-dialog v-if="can('edit') || can('create')" :title="$t('resources.WebsiteSuspend.dialog.title')" :visible.sync="dialogFormVisible">
      <crud-form :formData="activeRow" :status="dialogStatus" @cancel="dialogFormVisible = false" @create="createData" @update="updateData" />
    </el-dialog>

    <el-dialog :visible.sync="isVisible">
      <privilege-manage :list="showData"/>
    </el-dialog>

  </div>
</template>

<script>
import crudMixin from '../../../components/BaseCRUD/crud.mixin'
import { newResource } from '@/resources'
import PrivilegeManage from './privilegeManage'

export default {
  name: 'WebsiteManage',
  mixins: [crudMixin],
  data() {
    return {
      isVisible: false,
      authority: []
    }
  },
  computed: {
    showData() {
      return this.authority.rows
    }
  },
  methods: {
    async createData(data) {
      try {
        await this.model.create(data)
        this.dialogFormVisible = false
        this.handleCurrentChange(1)
        this.$notify({
          title: this.$t('success'),
          message: this.$t('base.success.create'),
          type: 'success',
          duration: 2000
        })
      } catch (err) {
        console.error(err)
      }
    },
    async updateData(data) {
      let temp = newResource(this.resource, data)
      try {
        temp = await this.model.update(temp)
        for (const v of this.list) {
          if (v.id === temp.id) {
            const index = this.list.indexOf(v)
            this.list.splice(index, 1, temp)
            break
          }
        }
        this.dialogFormVisible = false
        this.$notify({
          title: this.$t('success'),
          message: this.$t('base.success.update'),
          type: 'success',
          duration: 2000
        })
        this.getList()
      } catch (err) {
        console.error(err)
      }
    }
  },
  components: {
    PrivilegeManage
  }
}
</script>
