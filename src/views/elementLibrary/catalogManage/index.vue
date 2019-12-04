<template>
  <div class="catalogMange">
    <el-tree :data="treeData" :show-checkbox="false" node-key="id" default-expand-all :expand-on-click-node="false" :render-content="renderContent">
    </el-tree>
    <el-dialog :title="isUpdate ? '更新分类' : '新增分类' " :visible.sync=" dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="分类名称" prop="name">

          <el-input placeholder="请输入名称" v-model="form.name" :autofocus="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="普通用户" prop="pClassifyAccesses.commonUser" :label-width="formLabelWidth">
          <el-radio v-model="form.pClassifyAccesses.commonUser" :label="1">可见</el-radio>
          <el-radio v-model="form.pClassifyAccesses.commonUser" :label="0">不可见</el-radio>
        </el-form-item>
        <el-form-item label="vip" prop="pClassifyAccesses.vip" :label-width="formLabelWidth">
          <el-radio v-model="form.pClassifyAccesses.vip" :label="1">可见</el-radio>
          <el-radio v-model="form.pClassifyAccesses.vip" :label="0">不可见</el-radio>
        </el-form-item>
        <el-form-item label="t1" prop="pClassifyAccesses.t1" :label-width="formLabelWidth">
          <el-radio v-model="form.pClassifyAccesses.t1" :label="1">可见</el-radio>
          <el-radio v-model="form.pClassifyAccesses.t1" :label="0">不可见</el-radio>
        </el-form-item>
        <el-form-item label="t2" prop="pClassifyAccesses.t2" :label-width="formLabelWidth">
          <el-radio v-model="form.pClassifyAccesses.t2" :label="1">可见</el-radio>
          <el-radio v-model="form.pClassifyAccesses.t2" :label="0">不可见</el-radio>
        </el-form-item>
        <el-form-item label="t3" prop="pClassifyAccesses.t3" :label-width="formLabelWidth">
          <el-radio v-model="form.pClassifyAccesses.t3" :label="1">可见</el-radio>
          <el-radio v-model="form.pClassifyAccesses.t3" :label="0">不可见</el-radio>
        </el-form-item>
        <el-form-item label="t4" prop="pClassifyAccesses.t4" :label-width="formLabelWidth">
          <el-radio v-model="form.pClassifyAccesses.t4" :label="1">可见</el-radio>
          <el-radio v-model="form.pClassifyAccesses.t4" :label="0">不可见</el-radio>
        </el-form-item>
        <el-form-item label="t5" prop="pClassifyAccesses.t5" :label-width="formLabelWidth">
          <el-radio v-model="form.pClassifyAccesses.t5" :label="1">可见</el-radio>
          <el-radio v-model="form.pClassifyAccesses.t5" :label="0">不可见</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="() => dialogFormVisible = false">取消</el-button>
        <el-button v-if="isUpdate" @click="updateCatalog" :loading="loading" type="primary">更新</el-button>
        <el-button v-else @click="addCatalog" :loading="loading" type="primary">保存</el-button>
      </div>
    </el-dialog>
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
      dialogFormVisible: false,
      loading: false,
      isUpdate: false,
      formLabelWidth: '100px',
      form: {
        parentId: 0,
        name: '',
        pClassifyAccesses: {
          commonUser: 1,
          vip: 1,
          t1: 1,
          t2: 1,
          t3: 1,
          t4: 1,
          t5: 1
        }
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ],
        'pClassifyAccesses.commonUser': [
          {
            required: true,
            message: '必选',
            trigger: 'blur'
          }
        ],
        'pClassifyAccesses.vip': [
          {
            required: true,
            message: '必选',
            trigger: 'blur'
          }
        ],
        'pClassifyAccesses.t1': [
          {
            required: true,
            message: '必选',
            trigger: 'blur'
          }
        ],
        'pClassifyAccesses.t2': [
          {
            required: true,
            message: '必选',
            trigger: 'blur'
          }
        ],
        'pClassifyAccesses.t3': [
          {
            required: true,
            message: '必选',
            trigger: 'blur'
          }
        ],
        'pClassifyAccesses.t4': [
          {
            required: true,
            message: '必选',
            trigger: 'blur'
          }
        ],
        'pClassifyAccesses.t5': [
          {
            required: true,
            message: '必选',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  async mounted() {
    await this.initTreeData()
  },
  methods: {
    async initTreeData(res) {
      const { rows = [] } = await model.list({
        where: {},
        include: [
          {
            $model$: 'pClassifyAccesses',
            as: 'pClassifyAccesses'
          }
        ],
        order: [],
        distinct: true
      })
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
    async updateClassify(payload) {
      await model.update(payload)
      this.initTreeData()
    },
    appendPrompt(data) {
      delete this.form.id
      this.form.parentId = data.id
      this.form.name = ''
      this.form.pClassifyAccesses = {
        commonUser: 1,
        vip: 1,
        t1: 1,
        t2: 1,
        t3: 1,
        t4: 1,
        t5: 1
      }
      this.isUpdate = false
      this.dialogFormVisible = true
    },
    async addCatalog(data) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            await this.createClassify(this.form)
            this.dialogFormVisible = false
          } catch (error) {
            console.error(error)
          } finally {
            this.loading = false
          }
        }
      })
    },
    updateCatalog() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            await this.updateClassify(this.form)
            this.dialogFormVisible = false
          } catch (error) {
            console.error(error)
          } finally {
            this.loading = false
            this.form.name = ''
            this.form.parentId = 0
          }
        }
      })
    },
    updatePrompt(node, data) {
      this.isUpdate = true
      const { id, parentId, name, pClassifyAccesses } = data
      this.form = {
        id,
        parentId,
        name,
        pClassifyAccesses
      }
      this.dialogFormVisible = true
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
