<template>
  <div class="p-block-add" v-loading="isLoading" element-loading-text="拼命加载中">
    <div class="p-block-add-item">
      <span class="p-block-add-item-label">名称：</span>
      <input class="p-block-add-item-input" v-model="blockData.name" />
    </div>
    <div class="p-block-add-item">
      <span class="p-block-add-item-label">英文名称：</span>
      <input class="p-block-add-item-input" v-model="blockData.enName" />
    </div>
    <div class="p-block-add-item">
      <span class="p-block-add-item-label">文件名：</span>
      <input class="p-block-add-item-input" v-model="blockData.fileName" />
    </div>
    <div class="p-block-add-item">
      <span class="p-block-add-item-label">模型路径(.bmax,.x...)：</span>
      <input class="p-block-add-item-input" placeholder="bmax,.x..." v-model="blockData.fileUrl" />
      <el-upload class="p-block-add-item-upload" action="" :accept="modelTypes" :auto-upload="false" :show-file-list="false" :on-change="uploadModel">
        <el-button class="p-block-add-item-button" :loading="fileUrlUploading">上传</el-button>
      </el-upload>
    </div>
    <div class="p-block-add-item">
      <span class="p-block-add-item-label">动画路径(glb,gltf)：</span>
      <input class="p-block-add-item-input" placeholder="glb,gltf" v-model="blockData.previewUrl" />
      <el-upload class="p-block-add-item-upload" action="" :accept="animateTypes" :auto-upload="false" :show-file-list="false" :on-change="uploadAnimate">
        <el-button class="p-block-add-item-button" :loading="previewUrlUploading">上传</el-button>
      </el-upload>
    </div>
    <div class="p-block-add-item">
      <span class="p-block-add-item-label">动图路径(gif,jpg)：</span>
      <input class="p-block-add-item-input" placeholder="gif,jpg" v-model="blockData.gifUrl" />
      <el-upload class="p-block-add-item-upload" action="" :accept="imageTypes" :auto-upload="false" :show-file-list="false" :on-change="uploadGif">
        <el-button class="p-block-add-item-button" :loading="gifUrlUploading">上传</el-button>
      </el-upload>
    </div>
    <div class="p-block-add-item">
      <span class="p-block-add-item-label">文件类型：</span>
      <el-radio-group v-model="blockData.filetype">
        <el-radio label="bmax">bmax</el-radio>
        <el-radio label="template">template</el-radio>
        <el-radio label="stl">stl</el-radio>
        <el-radio label="x">x</el-radio>
        <el-radio label="fbx">fbx</el-radio>
      </el-radio-group>
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
import { getUploadToken } from '@/api/getToken'
import * as qiniu from 'qiniu-js'
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
      this.blockData.enName = _.get(this.value, 'extra.enName', '')
      this.blockData.fileName = _.get(this.value, 'extra.fileName')
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
      previewUrlUploading: false,
      fileUrlUploading: false,
      gifUrlUploading: false,
      classfiesList: {},
      blockData: {
        name: '',
        enName: '',
        fileName: '',
        fileUrl: '',
        previewUrl: '',
        filetype: '',
        gifUrl: '',
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
    },
    modelTypes() {
      return '.X,.x,.bmax,.template,.stl,.fbx'
    },
    animateTypes() {
      return '.gltf,.glb'
    },
    imageTypes() {
      return '.gif,.jpg'
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
    async uploadGif(file, fileList) {
      this.upload({ file, fileKey: 'gifUrl' })
    },
    async uploadAnimate(file, fileList) {
      this.upload({ file, fileKey: 'previewUrl' })
    },
    async uploadModel(file, fileList) {
      this.blockData.filetype = this.getFileExt(file.name)
      this.upload({ file, fileKey: 'fileUrl' })
    },
    async upload({ file, fileKey }) {
      const { token, key } = await getUploadToken()
      const observable = qiniu.upload(file.raw, key, token)
      const that = this
      const observer = {
        next(res) {},
        error(err) {
          console.error(err)
          that.$message.error('上传失败')
        },
        complete(res) {
          that.$message.success('上传成功')
          that.blockData[fileKey] = res.url
          that[`${fileKey}Uploading`] = false
        }
      }
      this[`${fileKey}Uploading`] = true
      observable.subscribe(observer)
    },
    async initTreeSelected(value) {
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
        pClassifies: this.getCheckedKeys(),
        extra: {
          enName: _.get(val, 'enName', ''),
          fileName: _.get(val, 'fileName', '')
        }
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
<style lang="scss">
.p-block-add {
  &-item {
    margin: 10px 0;
    &-label {
      display: inline-block;
      width: 160px;
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
    &-upload {
      display: inline-block;
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


