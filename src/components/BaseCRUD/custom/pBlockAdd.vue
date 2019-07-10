<template>
  <div class="p-block-add" v-loading="isLoading" element-loading-text="拼命加载中">
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
      <span class="p-block-add-item-label">动图路径：</span>
      <input class="p-block-add-item-input" v-model="blockData.gitUrl" />
      <el-button class="p-block-add-item-button" :loading="button_3_loading">上传
        <input type="file" class="input_file" @change="uploadGif('',$event)">
      </el-button>
    </div>
    <div class="p-block-add-item">
      <span class="p-block-add-item-label">文件类型：</span>
      {{ blockData.filetype }}
    </div>
    <div class="p-block-add-item">
      <span class="p-block-add-item-label">贡献者：</span>
      <input class="p-block-add-item-input" v-model="blockData.contributor" />
    </div>
    <div class="p-block-add-item">
      <span class="p-block-add-item-label">分类：</span>
      <el-tree :data="classfiesListData" @check-change="checkChange" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :props="defaultProps">
      </el-tree>
    </div>
  </div>
</template>
<script>
import { resourceCRUD } from '@/api/keepwork'
import _ from 'lodash'
const pClassifiesCRUD = resourceCRUD('pClassifies')

export default {
  name: 'pBlockAdd',
  props: {
    value: Object
  },
  async created() {
    this.classfiesList = await pClassifiesCRUD.list()
    this.isLoading = false
    if (this.value) {
      this.blockData.id = this.value.id
      this.blockData.name = this.value.name
      this.blockData.fileUrl = this.value.fileUrl
      this.blockData.previewUrl = this.value.previewUrl
      this.blockData.gifUrl = this.value.gifUrl
      this.blockData.filetype = this.value.filetype
      this.blockData.pBlockClassifies = this.value.pBlockClassifies
      this.blockData.size = this.value.size
      this.blockData.contributor = this.value.contributor
      this.initTreeSelected(this.value)
    }
  },
  data() {
    return {
      isLoading: true,
      button_1_loading: false,
      button_2_loading: false,
      button_3_loading: false,
      classfiesList: {},
      blockData: {
        name: '',
        fileUrl: '',
        previewUrl: '',
        filetype: '',
        pBlockClassifies: [],
        size: '',
        contributor: ''
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    classfiesListData() {
      const rows = _.get(this.classfiesList, 'rows', [])
      const list = _.map(rows, item => ({ ...item, label: item.name }))
      const parents = _.filter(list, item => item.parentId === 0)
      const children = _.filter(list, item => item.parentId)
      const translator = (parents, children) => {
        _.forEach(parents, parent => {
          _.forEach(children, (current, index) => {
            if (current.parentId === parent.id) {
              const temp = JSON.parse(JSON.stringify(children))
              temp.splice(index, 1)
              translator([current], temp)
              Array.isArray(parent.children)
                ? parent.children.push(current)
                : (parent.children = [current])
            }
          })
        })
      }
      translator(parents, children)
      return parents
    }
  },
  watch: {
    blockData: {
      handler: function(val, oldVal) {
        this.emitInput(val)
      },
      deep: true
    }
  },
  methods: {
    async uploadGif(params, evt) {
      const ext = this.getFileExt(_.get(evt, 'target.value', ''))
      console.dir(ext)
    },
    async uploadAnimate() {

    },
    async uploadModel() {

    },
    async upload(params, e) {},
    async initTreeSelected(value) {
      await this.$nextTick()
      const pBlockClassifies = _.get(value, 'pBlockClassifies', [])
      const IDs = _.map(pBlockClassifies, item => _.get(item, 'pClassifies.id'))
      this.$refs.tree.setCheckedKeys(IDs)
    },
    emitInput(val) {
      val = val || this.blockData
      const data = {
        id: val.id,
        name: val.name,
        fileUrl: val.fileUrl,
        previewUrl: val.previewUrl,
        filetype: val.filetype,
        gifUrl: val.gifUrl,
        pBlockClassifies: this.getCheckedKeys(),
        size: val.size,
        contributor: val.contributor,
        pClassifies: this.getCheckedKeys()
      }
      this.$emit('input', data)
    },
    getCheckedKeys() {
      const classfierIdArr = this.$refs.tree.getCheckedKeys()
      const rows = _.get(this.classfiesList, 'rows', [])
      const selectedLabels = _.filter(rows, i => {
        return _.includes(classfierIdArr, i.id)
      })
      return selectedLabels
    },
    checkChange(data) {
      this.emitInput()
    },
    getFileExt(_filename) {
      let ext = /.+\./.test(_filename) ? _filename.split('.').pop() : ''
      ext = (ext || '').toLowerCase()
      return ext
    }
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
    /deep/ .el-tree {
      padding-left: 120px;
    }
  }
}
</style>


