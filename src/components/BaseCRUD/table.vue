<template>
  <div class="table-container" v-loading="listLoading">
    <el-table ref="multipleTable" :data="list" element-loading-text="Loading..." border fit highlight-current-row style="width: 100%" @sort-change="handleSort" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column align="center" v-for="col in attrs" :key="col.alias || col.name" :prop="col.name" :label="i18n(col.alias || col.name)" :width="col.width" :sortable="col.sortable === undefined ? 'custom' : col.sortable">
        <template slot-scope="scope">
          <span> {{filter(col, scope.row)}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" :width="actionAreaWidth" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button v-if="can('show')" size="mini" @click="handleAction('show', scope.row)">{{$t('show')}}</el-button>
          <el-button v-if="can('edit')" type="primary" size="mini" @click="handleAction('edit', scope.row)">{{$t('edit')}}</el-button>
          <el-button v-if="can('destroy')" type="warning" size="mini" @click="handleAction('delete', scope.row)">{{$t('delete')}}</el-button>
          <template v-for="op in canActions">
            <el-button v-if="op.title(scope.row)" :key="op.name" @click="handleAction(op.name, scope.row)" size="mini" :type="op.type ? op.type(scope.row) : op.button">{{op.title(scope.row)}}</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import _ from 'lodash'
import { rolesCan } from '@/utils/cancan'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'CRUDTable',
  props: {
    listLoading: Boolean,
    filter: {
      type: Function,
      default: (col, value) => {
        return value
      }
    }
  },
  data() {
    return {
      cachedCan: {}
    }
  },
  methods: {
    ...mapActions({
      setSelectedResouces: 'setSelectedResouces'
    }),
    i18n(col) {
      return this.resourceClass.i18n(col)
    },
    can(action) {
      if (this.cachedCan[action] === undefined) {
        if (
          this.resourceClass.actions().disabled &&
          _.indexOf(this.resourceClass.actions().disabled, action) === -1
        ) {
          this.cachedCan[action] = rolesCan(
            this.roles,
            action,
            this.resourceClass
          )
        } else {
          this.cachedCan[action] = false
        }
      }
      return this.cachedCan[action]
    },
    handleAction(action, row) {
      this.$emit('handleAction', action, row)
    },
    handleSort(evt) {
      const order = evt.order === 'descending' ? 'desc' : 'asc'
      this.$emit('handleSort', evt.prop, order)
    },
    handleSelectionChange(selectedResources) {
      this.setSelectedResouces({ selectedResources })
    }
  },
  computed: {
    ...mapGetters({
      roles: 'roles',
      resourceClass: 'resourceClass',
      list: 'resourceList'
    }),
    actionAreaWidth() {
      const defaultAction = ['show', 'edit', 'destroy']
      const disabled = this.resourceClass.actions().disabled || []
      const extraLength = this.canActions.length
      const buttonWidth = 110
      return (
        (_.difference(defaultAction, disabled).length + extraLength) *
        buttonWidth
      )
    },
    canActions() {
      const extraAxtions = this.resourceClass.actions().extra || []
      _.remove(extraAxtions, action => {
        return !this.can(action.name)
      })
      return extraAxtions
    },
    attrs() {
      return this.resourceClass.showableAttrs()
    }
  }
}
</script>

<style>
.table-container {
  margin: 10px 0px;
}
</style>
