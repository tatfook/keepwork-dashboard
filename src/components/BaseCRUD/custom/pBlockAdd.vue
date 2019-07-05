<template>
  <div class="p-block-add">
    <div class="p-block-add-item">
      <span class="p-block-add-item-label">名称：</span>
      <input class="p-block-add-item-input" v-model="blockData.name" />
    </div>
    <div class="p-block-add-item">
      <span class="p-block-add-item-label">模型路径：</span>
      <input class="p-block-add-item-input" v-model="blockData.fileUrl" />
      <el-button class="p-block-add-item-button" :loading="button_1_loading">上传
        <input type="file" class="input_file" @change="upload('',$event)">
      </el-button>
    </div>
    <div class="p-block-add-item">
      <span class="p-block-add-item-label">动画路径：</span>
      <input class="p-block-add-item-input" v-model="blockData.previewUrl" />
      <el-button class="p-block-add-item-button" :loading="button_2_loading">上传
        <input type="file" class="input_file" @change="upload('',$event)">
      </el-button>
    </div>
    <div class="p-block-add-item">
      <span class="p-block-add-item-label">文件类型：</span>
      <el-radio-group v-model="blockData.filetype">
        <el-radio label="bmax">bmax</el-radio>
        <el-radio label="template">template</el-radio>
        <el-radio label="stl">stl</el-radio>
        <el-radio label="X">X</el-radio>
      </el-radio-group>
    </div>
    <div class="p-block-add-item">
      <span class="p-block-add-item-label">贡献者：</span>
      <input class="p-block-add-item-input" v-model="blockData.contributor" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'pBlockAdd',
  props: {
    value: Object
  },
  async created() {
    console.log('value', this.value)
    await this.getPBlockClassifies()

    if (this.value) {
      this.blockData.name = this.value.name
      this.blockData.fileUrl = this.value.fileUrl
      this.blockData.previewUrl = this.value.previewUrl
      this.blockData.filetype = this.value.filetype
      this.blockData.contributor = this.value.contributor
      this.blockData.pBlockClassifies = this.value.pBlockClassifies
    }
  },
  data() {
    return {
      button_1_loading: false,
      button_2_loading: false,
      blockData: {
        name: '',
        fileUrl: '',
        previewUrl: '',
        filetype: 'X',
        contributor: '',
        pBlockClassifies: []
      }
    }
  },
  methods: {
    getPBlockClassifies() {},
    upload(params, e) {}
  }
}
</script>
<style lang="scss" scoped>
.p-block-add {
  &-item {
    margin: 10px 0;
    &-label {
      display: inline-block;
      width: 120px;
      text-align: right;
      padding-right: 10px;
    }
    &-input {
      height: 40px;
      width: 200px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      padding-left: 15px;
    }
    &-button {
      padding: 0 20px;
      height: 40px;
      line-height: 40px;
      position: relative;
      .input_file {
        line-height: 40px;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        width: 60px;
        opacity: 0;
      }
    }
  }
}
</style>


