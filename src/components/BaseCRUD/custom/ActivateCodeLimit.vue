<template>
  <div class="activate-code-limit">
    <div class="activate-code-limit-item">
      <span class="activate-code-limit-item-title">
        3个月
      </span>
      <el-input-number v-model="activateCodeLimit.type5" :min="0" :max="100000" label="描述文字"></el-input-number>
    </div>
    <div class="activate-code-limit-item">
      <span class="activate-code-limit-item-title">
        半年
      </span>
      <el-input-number v-model="activateCodeLimit.type6" :min="0" :max="100000" label="描述文字"></el-input-number>
    </div>
    <div class="activate-code-limit-item">
      <span class="activate-code-limit-item-title">
        1年(送3个月)
      </span>
      <el-input-number v-model="activateCodeLimit.type7" :min="0" :max="100000" label="描述文字"></el-input-number>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: '',
    status: ''
  },
  data() {
    return {
      activateCodeLimit: {
        type5: 0,
        type6: 0,
        type7: 0
      }
    }
  },
  created() {
    if (this.status === 'update') {
      this.activateCodeLimit = this.value || {
        type5: 0,
        type6: 0,
        type7: 0
      }
    }
  },
  watch: {
    activateCodeLimit: {
      handler(value) {
        console.log(value)
        this.$emit('input', value)
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
.activate-code-limit {
  &-item {
    margin-top: 10px;
    &-title {
      display: inline-block;
      min-width: 100px;
    }
  }
}
</style>

