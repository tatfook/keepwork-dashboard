<template>
  <!-- <el-table :data="userGroups" border style="width: 100%" height="476"> -->
  <el-table>
    <el-table-column label="组名" width="96" fixed>
      <template slot-scope="scope">
        <!-- <span :title="scope.row.groupname">{{scope.row.groupname}}</span> -->
      </template>
    </el-table-column>
    <el-table-column label="成员">
      <template slot-scope="scope">
        <!-- <span v-for="(member, index) in scope.row.members" :key="index">{{member.username}}, </span> -->
      </template>
    </el-table-column>
    <el-table-column label="权限">
      <template slot-scope="scope">
        <!-- <span>{{scope.row.level | levelFilter}}</span> -->
      </template>
    </el-table-column>
  </el-table>
</template>
