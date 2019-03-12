<template>
  <div class="input-file">
    <i class="el-icon-delete input-file-button " @click="handleClear"></i>
    <input class="input-file-upload" ref="inputFile" type="file" @change="handleSelectImage" accept="image/*">
    <img ref="image" :src="src">
  </div>
</template>
<script>
export default {
  mounted() {
    this.src = this.value
  },
  props: {
    value: ''
  },
  data() {
    return {
      src: ''
    }
  },
  methods: {
    handleSelectImage(evt) {
      const files = evt.target.files
      if (files.length) {
        const img = evt.target.files[0]
        const render = new FileReader()
        render.onload = () => {
          this.src = render.result
          this.$emit('input', render.result)
        }
        render.readAsDataURL(img)
      }
    },
    handleClear() {
      this.src = ''
      this.$emit('input', '')
    }
  }
}
</script>

<style lang="css">
.input-file-upload {
  width: 80%;
}

.input-file-button {
  font-size: 22px;
  margin-right: 5px;
  cursor: pointer;
}
</style>

