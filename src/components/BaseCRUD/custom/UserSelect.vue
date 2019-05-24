<template>
  <div>
    <el-select style="width:450px" v-model="value" multiple filterable remote reserve-keyword placeholder="请输入用户名" :remote-method="remoteMethod" :loading="loading">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import user from '@/models/user'

const userCRUD = user()
export default {
  name: 'UserSelect',
  data() {
    return {
      loading: false,
      options: [{ label: '', value: '' }],
      value: []
    }
  },
  watch: {
    value(value) {
      this.$emit('input', value)
    }
  },
  methods: {
    async remoteMethod(username) {
      if (username) {
        const { rows: userList } = await userCRUD.list({
          where: { username: { $like: `%${username}%` }},
          order: [],
          limit: 100,
          offset: 0
        })
        this.options = userList.map(item => ({ label: item.username, value: item.id }))
        console.log(this.options)
      }
    }
  }
}
</script>


