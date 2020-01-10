<template>
  <div class="dialog-custom">
    <package-select v-model="organizationIDs"></package-select>
    <div class="dialog-custom-footer">
      <el-button class="dialog-custom-footer-button" @click="onConfirm" :loading="loading" type="primary">确定</el-button>
      <el-button class="dialog-custom-footer-button" @click="() => this.$emit('cancel')">取消</el-button>
    </div>
  </div>
</template>


<script>
import PackageSelect from './PackageSelect'
export default {
  components: {
    PackageSelect
  },
  props: {
    loading: false
  },
  data() {
    return {
      organizationIDs: []
    }
  },
  methods: {
    onConfirm() {
      this.$emit('callback', this.organizationIDs)
    }
  }
}
</script>


<style lang="scss" scoped>
.dialog-custom {
  &-footer {
    display: flex;
    flex-direction: row-reverse;
    &-button {
      margin-right: 10px;
    }
  }
}
</style>