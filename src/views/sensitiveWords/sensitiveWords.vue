<template>
  <div class="app-container">
    <div class="action-container">
      <el-button v-if="can('create')" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">{{$t('new')}}</el-button>
      <el-button v-if="can('export')" class="filter-item" type="primary" icon="el-icon-download" :loading="downloadLoading" @click="handleExport">{{$t('export')}}</el-button>
      <el-button v-if="can('delete')" class="filter-item" style="margin-left: 10px;" @click="handleDeleteAll" type="primary" icon="el-icon-plus">{{$t('deleteAll')}}</el-button>
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

    <el-dialog v-if="can('show')" :visible.sync="showingFormVisible">
      <crud-show :list="showingData" />
    </el-dialog>

  </div>
</template>

<script>
import crudMixin from '../../components/BaseCRUD/crud.mixin'
import { Message } from 'element-ui'
import { newResource } from '@/resources'

export default {
  name: 'SensitiveWords',
  mixins: [crudMixin],
  methods: {
    async createData(data) {
      try {
        const createDataRepeated = await this.model.create(data)
        if (createDataRepeated) {
          this.dialogFormVisible = false
          this.handleCurrentChange(1)
          this.$notify({
            title: this.$t('success'),
            message: this.$t('base.success.create'),
            type: 'success',
            duration: 2000
          })
        } else {
          Message({
            message: this.$t('resources.SensitiveWords.tips.keyWord'),
            type: 'error',
            duration: 5 * 1000
          })
        }
      } catch (err) {
        Message({
          message: this.$t('resources.SensitiveWords.tips.keyWord'),
          type: 'error',
          duration: 5 * 1000
        })
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
        Message({
          message: this.$t('resources.SensitiveWords.tips.updateError'),
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
  }
}
</script>
