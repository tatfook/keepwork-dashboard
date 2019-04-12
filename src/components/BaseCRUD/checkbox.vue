<template>
  <div class="checkbox-dialog">
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
    <div style="margin: 15px 0"></div>
    <el-checkbox-group v-model="checkList" @change="handleSelectedChange">
      <el-checkbox v-for="item in list" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
    </el-checkbox-group>
    <div slot="footer" class="checkbox-confirm-footer ">
      <el-button @click="cancel">{{$t('cancel')}}</el-button>
      <el-button type="primary" @click="updateData">{{$t('save')}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CRUDCheckbox',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      checkAll: false,
      checkList: [],
      isIndeterminate: false
    }
  },
  methods: {
    handleCheckAllChange(selected) {
      this.checkList = selected ? this.list.map(item => item.value) : []
      this.isIndeterminate = false
    },
    handleSelectedChange(checkList) {
      const checkCount = checkList.length
      this.checkAll = checkCount === this.list.length
      this.isIndeterminate = checkCount > 0 && checkCount < this.list.length
    },
    cancel() {
      this.$emit('cancel')
    },
    updateData() {
      this.$emit('callback', this.checkList)
    }
  }
}
</script>

<style scoped>
.checkbox-confirm-footer {
  text-align: right;
}
</style>
