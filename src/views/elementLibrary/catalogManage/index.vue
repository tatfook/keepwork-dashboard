<template>
  <div class="catalogMange">
    <el-tree v-if="showTree" :data="treeData" :show-checkbox="false" node-key="id" default-expand-all :expand-on-click-node="false" :render-content="renderContent">
    </el-tree>
  </div>
</template>


<script>
import _ from 'lodash'
import { resourceCRUD } from '@/api/keepwork'
const model = resourceCRUD('pClassifies')
export default {
  data() {
    return {
      treeData: [],
      showTree: true
    }
  },
  async mounted() {
    await this.initTreeData()
  },
  methods: {
    async initTreeData(res) {
      const { rows = [] } = await model.list()
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
      this.treeData = [
        {
          id: 0,
          label: '目录列表',
          children: parents
        }
      ]
      this.showTree = true
    },
    async createClassify(payload) {
      await model.create(payload)
      this.initTreeData()
    },
    async deleteClassify(data) {
      const toDelItems = []
      const getChildren = obj => {
        const { children = [], ...rest } = obj
        if (children && children.length > 0) {
          _.forEach(children, item => getChildren(item))
        }
        toDelItems.push(rest)
      }
      getChildren(data)
      const fetchDelete = toDelItems.map(params => model.destroy(params))
      await Promise.all(fetchDelete)
      this.initTreeData()
    },
    async udpateClassify(payload) {
      await model.update(payload)
      this.initTreeData()
    },
    refreshTree() {
      // TODO: bad way
      this.showTree = false
      this.$nextTick(() => (this.showTree = true))
    },
    appendPrompt(data) {
      this.$prompt('请输入名称', '添加分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
        inputErrorMessage: '请输入名称'
      })
        .then(({ value }) => {
          this.createClassify({ parentId: data.id, name: value })
        })
        .catch(e => {
          console.error(e)
        })
    },
    updatePrompt(node, data) {
      this.$prompt('请输入名称', '更新分类', {
        confirmButtonText: '更新',
        cancelButtonText: '取消',
        inputPattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
        inputErrorMessage: '请输入名称',
        inputValue: data.label || ''
      })
        .then(async({ value }) => {
          this.udpateClassify({
            ...data,
            name: value
          })
        })
        .catch(e => {
          console.error(e)
        })
    },
    removeConfirm(node, data) {
      this.$confirm(`确定删除 ${data.label}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteClassify(data)
        })
        .catch(e => console.error(e))
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
          <span>
            <el-button
              size='mini'
              type='text'
              class='add-btn'
              on-click={() => this.appendPrompt(data)}
            >
              添加
            </el-button>
            {data.id > 0 && (
              <el-button
                size='mini'
                type='text'
                class='remove-btn'
                on-click={() => this.updatePrompt(node, data)}
              >
                编辑
              </el-button>
            )}
            {data.id > 0 && (
              <el-button
                size='mini'
                type='text'
                class='remove-btn'
                on-click={() => this.removeConfirm(node, data)}
              >
                删除
              </el-button>
            )}
          </span>
        </span>
      )
    }
  }
}
</script>


<style>
.catalogMange {
  margin: 30px;
}

.catalogMange .add-btn {
  margin-left: 20px;
}
</style>
