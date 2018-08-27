<template>
  <div class="form-container">
    <el-form :rules="attrRules" ref="dataForm" :model="model" label-position="left" label-width="120px" style='width: 400px; margin-left:50px;'>
      <el-form-item v-for="attr in attrs" :key="attr.name" :label="attr.name" :prop="attr.name">
        <el-select v-if="attr.associate" v-model="model[attr.name]" filterable remote :remote-method="searchAssociate(attr)" :loading="loading">
          <el-option v-for="item in associateOptions[attr.name]" :key="item.key" :label="item.value" :value="item.key">
          </el-option>
        </el-select>
        <el-input v-else-if="attrComponent(attr, 'input')" v-model="model[attr.name]"></el-input>
        <el-select v-else-if="attrComponent(attr, 'select')" v-model="model[attr.name]">
          <el-option v-for="item in attr.options" :key="item.key" :label="item.value" :value="item.key">
          </el-option>
        </el-select>
        <el-date-picker v-else-if="attrComponent(attr, 'time')" v-model="model[attr.name]" type="datetime"></el-date-picker>
        <el-rate v-else-if="attrComponent(attr, 'rate')" style="margin-top:8px;" v-model="model[attr.name]" :colors="attr.colors" :max='attr.max'></el-rate>
      </el-form-item>
    </el-form>
    <div slot="footer" class="form-footer">
      <el-button @click="cancel">cancel</el-button>
      <el-button v-if="status=='create'" type="primary" @click="createData">save</el-button>
      <el-button v-else type="primary" @click="updateData">update</el-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { getResourceClass } from '@/resources'

export default {
  name: 'CRUDFrom',
  props: {
    resourceClass: {
      required: true
    },
    status: String,
    formData: Object
  },
  data() {
    return {
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      model: {},
      associateOptions: {},
      loading: false
    }
  },
  created() {
    this.model = _.cloneDeep(this.formData || {})
    this.loadModelAssociate()
  },
  watch: {
    formData(data) {
      this.model = _.cloneDeep(data || {})
      this.loadModelAssociate()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  },
  methods: {
    attrComponent(attr, type) {
      const comp = attr.component || 'input'
      return comp === type
    },
    async loadModelAssociate() {
      this.loading = true
      this.associateOptions = {}
      for (const attr of this.attrs) {
        if (attr.associate && this.model[attr.name]) {
          const associateClass = getResourceClass(attr.associate)
          const item = await associateClass.api().get(this.model[attr.name])
          this.associateOptions[attr.name] = [{ key: item.id, value: item[associateClass.title()] }]
        }
      }
      this.loading = false
    },
    searchAssociate(attr) {
      const self = this
      const associateClass = getResourceClass(attr.associate)
      return async(query) => {
        if (query !== '') {
          this.loading = true
          const list = await associateClass.api().list({
            [associateClass.title() + '-like']: query + '%',
            'x-per-page': 50
          })
          self.associateOptions[attr.name] = list.rows.map((item) => {
            return {
              key: item.id,
              value: item[associateClass.title()]
            }
          })
          this.loading = false
        }
      }
    },
    cancel() {
      this.$emit('cancel')
    },
    async createData() {
      const valid = await this.$refs['dataForm'].validate()
      valid && this.$emit('create', this.model)
    },
    async updateData() {
      const valid = await this.$refs['dataForm'].validate()
      valid && this.$emit('update', this.model)
    }
  },
  computed: {
    attrs() {
      return this.resourceClass.editableAttrs()
    },
    attrRules() {
      return this.resourceClass.attrRules()
    }
  }
}
</script>

<style scoped>
  .form-footer {
    text-align: right;
  }
</style>

