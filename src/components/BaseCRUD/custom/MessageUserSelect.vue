<template>
  <div>
    <el-switch
    inactive-text="所有人"
    active-text="指定用户"
    @change="onChange"
    v-model="isAssign">
    </el-switch>
    <user-select v-if="isAssign" v-model="value"></user-select>
  </div>
</template>

<script>
import UserSelect from './UserSelect'

export default {
  name: 'MessageUserSelect',
  components: {
    UserSelect
  },
  data() {
    return {
      loading: false,
      options: [{ label: '', value: '' }],
      value: [],
      isAssign: false
    }
  },
  methods: {
    onChange(value) {
      if (!value) {
        this.$emit('input', [])
      }
    }
  },
  watch: {
    value(value) {
      this.$emit('input', value)
    }
  }
}
</script>


