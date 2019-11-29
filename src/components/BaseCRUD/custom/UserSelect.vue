<template>
  <div>
    <el-select style="width:450px" v-model="selectedList" multiple filterable remote reserve-keyword placeholder="请输入用户名" :remote-method="remoteMethod" :loading="loading">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import user from '@/models/user'
import _ from 'lodash'

const userCRUD = user()
export default {
  name: 'UserSelect',
  data() {
    return {
      loading: false,
      options: [{ label: '', value: '' }],
      selectedList: []
    }
  },
  watch: {
    selectedList(selectedList) {
      this.$emit('input', _.map(selectedList, item => item.value))
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

        const _userList = userList.map(item => ({
          label: item.username,
          value: item.id
        }))
        this.options = _.uniqBy([..._userList, ...this.selectedList], 'value')
      }
    }
  }
}
</script>


