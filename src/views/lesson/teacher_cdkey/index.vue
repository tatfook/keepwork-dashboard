<template>
  <div class="app-container">
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column label="Key">
        <template slot-scope="scope">
          {{scope.row.key}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getTeacherCDKeys } from '@/api/lesson'

export default {
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  async created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      const res = await getTeacherCDKeys()
      this.list = res.data.map(key => {
        return { key: key }
      })
      this.listLoading = false
    }
  }
}
</script>
