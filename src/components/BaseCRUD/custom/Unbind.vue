<template>
  <div class="unbind-container" v-loading="unbinding">
    <div class="unbind-item" v-for="index in [0,1,2,3]" :key="index">
      <span class="unbind-item-type">{{ index | formatBindType }}:</span> <span class="unbind-item-name">{{unbindTypeList[index].id ? unbindTypeList[index].externalUsername : '未绑定'}}</span>
      <el-button v-if="unbindTypeList[index].id" @click="unbindOauth(unbindTypeList[index])" type="warning" size="mini">解绑</el-button>
    </div>
    <div class="unbind-item email">
      <span class="unbind-item-type">邮箱:</span> <span class="unbind-item-name">{{email || '未绑定'}}</span>
      <el-button v-if="email" type="warning" size="mini" @click="unbindEmail">解绑</el-button>
      <el-button v-else size="mini" @click="bindEmail">绑定</el-button>
    </div>
    <div class="unbind-item cellphone">
      <span class="unbind-item-type">手机号:</span> <span class="unbind-item-name">{{cellphone || '未绑定' }}</span>
      <el-button v-if="cellphone" type="warning" size="mini" @click="unbindCellphone">解绑</el-button>
      <el-button v-else size="mini" @click="bindCellphone">绑定</el-button>
    </div>
  </div>
</template>

<script>
import { resourceCRUD } from '@/api/keepwork'
const oauthUsers = resourceCRUD('oauthUsers')
const userCRUD = resourceCRUD('users')
import _ from 'lodash'
const TYPES = {
  0: 'QQ',
  1: '微信',
  2: 'github',
  3: '新浪'
}
export default {
  props: {
    customRowData: Object
  },
  filters: {
    formatBindType(value) {
      return TYPES[value] || ''
    }
  },
  data() {
    return {
      bindList: [],
      unbinding: false,
      cellphone: '',
      email: ''
    }
  },
  methods: {
    async unbindOauth(data) {
      this.$confirm(
        `解绑 ${TYPES[data.type]}账号 ${data.externalUsername}？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async() => {
          this.unbinding = true
          await oauthUsers.destroy(data)
          await this.initData()
          this.unbinding = false
          this.$message({
            type: 'success',
            message: '解绑成功'
          })
        })
        .catch(e => {
          console.error(e)
        })
    },
    async unbindCellphone() {
      this.$confirm(`解绑手机号 ${this.cellphone}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.unbinding = true
          await userCRUD.update({
            id: this.customRowData.id,
            cellphone: ''
          })
          this.$emit('callback')
          this.cellphone = ''
          this.unbinding = false
          this.$message({
            type: 'success',
            message: '解绑成功'
          })
        })
        .catch(e => {
          console.error(e)
        })
    },
    async bindCellphone() {
      this.$prompt('请输入手机号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^1[3456789]\d{9}$/,
        inputErrorMessage: '手机号格式不正确'
      })
        .then(async({ value }) => {
          this.unbinding = true
          await userCRUD.update({
            id: this.customRowData.id,
            cellphone: value
          })
          this.cellphone = value
          this.unbinding = false
          this.$emit('callback')
          this.$message({
            type: 'success',
            message: '绑定成功'
          })
        })
        .catch(e => {
          const code = _.get(e, 'response.status', '')
          if (code === 409) {
            this.$message.error('手机号已被绑定')
          }
          this.unbinding = false
          console.error(e)
        })
    },
    async unbindEmail() {
      this.$confirm(`解绑邮箱 ${this.email}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.unbinding = true
          await userCRUD.update({
            id: this.customRowData.id,
            email: ''
          })
          this.email = ''
          this.unbinding = false
          this.$emit('callback')
          this.$message({
            type: 'success',
            message: '解绑成功'
          })
        })
        .catch(e => {
          console.error(e)
        })
    },
    async bindEmail() {
      this.$prompt('请输入邮箱', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '邮箱格式不正确'
      })
        .then(async({ value }) => {
          this.unbinding = true
          await userCRUD.update({
            id: this.customRowData.id,
            email: value
          })
          this.email = value
          this.unbinding = false
          this.$emit('callback')
          this.$message({
            type: 'success',
            message: '绑定成功'
          })
        })
        .catch(e => {
          const code = _.get(e, 'response.status', '')
          if (code === 409) {
            this.$message.error('邮箱已被绑定')
          }
          this.unbinding = false
          console.error(e)
        })
    },
    async initData() {
      const { id } = this.customRowData
      const res = await oauthUsers.list({ where: { userId: { $eq: id }}})
      this.bindList = res.rows
    }
  },
  async mounted() {
    this.initData()
    this.cellphone = this.customRowData.cellphone
    this.email = this.customRowData.email
  },
  computed: {
    unbindTypeList() {
      const _types = {
        0: {},
        1: {},
        2: {},
        3: {}
      }
      this.bindList.forEach(item => {
        _types[item.type] = item
      })
      return _types
    }
  }
}
</script>


<style>
.unbind-container {
  padding: 0 40px;
}
.unbind-container .unbind-item {
  margin-top: 20px;
}

.unbind-container .unbind-item-type {
  display: inline-block;
  width: 70px;
}

.unbind-container .unbind-item-name {
  display: inline-block;
  width: 180px;
}
</style>
