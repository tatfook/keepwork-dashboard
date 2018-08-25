<template>
  <div class="table-container" v-loading="listLoading">
    <el-table v-if="!listLoading" :data="list" element-loading-text="Loading..." border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" v-for="col in attrs" :key="col.name" :label="col.name" :width="col.width">
        <template slot-scope="scope">
          <span> {{filter(col, rowValue(scope.row.data, col.name))}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" :width="actionAreaWidth" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="can('show')" size="mini" @click="handleAction('show', scope.row.data)">show</el-button>
          <el-button v-if="can('edit')" type="primary" size="mini" @click="handleAction('edit', scope.row.data)">edit</el-button>
          <el-button v-if="can('delete')" type="warning" size="mini" @click="handleAction('delete', scope.row.data)">delete</el-button>
          <el-button v-for="op in extraActions" :key="op.name" @click="handleAction(op.name, scope.row.data)" size="mini" :type="op.type">{{op.name}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'CRUDTable',
  props: {
    listLoading: Boolean,
    list: {
      type: Array,
      default: () => {
        return {}
      }
    },
    attrs: {
      type: Array,
      required: true
    },
    actions: {
      type: Object,
      required: true
    },
    filter: {
      type: Function,
      default: (col, value) => {
        return value
      }
    }
  },
  methods: {
    can(action) {
      return !(
        this.actions.disabled && _.indexOf(this.actions.disabled, action) !== -1
      )
    },
    rowValue(row, key) {
      return _.get(row, key)
    },
    handleAction(action, row) {
      this.$emit('handleAction', action, row)
    }
  },
  computed: {
    actionAreaWidth() {
      const defaultLength = ['show', 'edit', 'destroy'].length
      const disableLength = (this.actions.disabled || []).length
      const extraLength = (this.actions.extra || []).length
      const buttonWidth = 80
      return (defaultLength - disableLength + extraLength) * buttonWidth
    },
    extraActions() {
      return this.actions.extra || []
    }
  }

}
</script>

<style>
  .table-container {
    margin: 10px 0px
  }
</style>
