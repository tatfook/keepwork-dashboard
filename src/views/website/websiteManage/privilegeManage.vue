<template>
  <el-table :data="list" border style="width: 100%">
    <el-table-column :label="$t('dialog.label.groupsName')" fixed>
      <template slot-scope="scope">
        <span>{{scope.row.groupName}}</span>
      </template>
    </el-table-column>
    <el-table-column :label="$t('dialog.label.members')">
      <template slot-scope="scope">
        <span v-for="(name, index) in scope.row.userName" :key="index">{{name}},</span>
      </template>
    </el-table-column>
    <el-table-column :label="$t('dialog.label.permission')">
      <template slot-scope="scope">
        <span>{{scope.row.level}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'PrivilegeManage',
  props: {
    list: Array
  }
}
</script>
