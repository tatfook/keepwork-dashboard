<template>
  <el-table :data="list" border style="width: 100%">
    <el-table-column label="组名" fixed>
      <template slot-scope="scope">
        <span>{{scope.row.groupName}}</span>
      </template>
    </el-table-column>
    <el-table-column label="成员">
      <template slot-scope="scope">
        <span v-for="(memberName, index) in scope.row.memberNameArr" :key="index">{{memberName}},</span>
      </template>
    </el-table-column>
    <el-table-column label="权限">
      <template slot-scope="scope">
        <span>{{scope.row.level}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import _ from 'lodash'
// import { mapGetters } from 'vuex'

export default {
  name: 'PrivilegeManage',
  props: {
    list: Array,
    formData: Object
  },
  methods: {
    initModel() {
      this.model = _.cloneDeep(this.formData || {})

      // if (this.status === 'create') {
      //   this.loadDefaultValues()
      // }
      // this.loadModelAssociate()
    }
    // i18n(col) {
    //   return this.resourceClass.i18n(col)
    // }
  },
  computed: {
    // ...mapGetters({
    //   resourceClass: 'resourceClass'
    // })
  }
}
</script>
