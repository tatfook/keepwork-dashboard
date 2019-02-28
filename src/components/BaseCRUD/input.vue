<template>
  <div class="input-dialog">
    <div class="input-dialog-input-row" v-for="item in inputArr" :key="item.key">
      <!-- <div class="input-dialog-input-row-label"> {{item.label || item.key}}:</div> -->
      <el-form :model="item" ref='form' label-position="left" label-width="120px" >
        <el-form-item  :label="item.label"  :rules="item.rules" prop="value">
          <el-input style="width: 200px;" size="medium" v-model="item.value"/>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" style="text-align: right;">
      <el-button @click="cancel">{{$t('cancel')}}</el-button>
      <el-button type="primary" @click="confirm">{{$t('ok')}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CRUDInput',
  props: {
    list: Array
  },
  data() {
    return {
      inputArr: []
    }
  },
  mounted() {
    this.inputArr = this.list
  },
  methods: {
    confirm() {
      this.$refs.form[0].validate((valid) => {
        if (valid) {
          this.$emit('callback', this.inputArr)
        } else {
          this.$message.error('格式错误')
        }
      })
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
.input-dialog {
  max-width: 800px;
}

.input-dialog-input-row {
  display: flex;
  margin-top: 20px;
  align-items: center;
}
.input-dialog-input-row-label {
  margin-right: 10px;
  min-width: 80px;
}
</style>

