<template>
  <el-input placeholder="请输入" v-model="url" @change="handleInput">
    <template slot="prepend">{{prefixUrl}}</template>
  </el-input>
</template>

<script>
const ENV = process.env.NODE_ENV
export default {
  props: {
    value: ''
  },
  data() {
    return {
      url: ''
    }
  },
  watch: {
    value: {
      handler(value) {
        this.url = value
      },
      immediate: true
    }
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value)
    }
  },
  computed: {
    prefixUrl() {
      if (ENV === 'stage' || ENV === 'release') {
        return `${ENV}.keepwork.com/org/`
      }
      return 'keepwork.com/org/'
    }
  }
}
</script>



