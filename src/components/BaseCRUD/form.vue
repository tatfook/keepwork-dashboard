<template>
  <div class="form-container">
    <el-form :rules="attrRules" ref="dataForm" :model="model" label-position="left" label-width="120px" style='width: 400px; margin-left:50px;'>
      <el-form-item v-for="attr in attrs" :key="attr.name" :label="attr.name" :prop="attr.name">
        <el-input v-if="attrType(attr, 'input')" v-model="model[attr.name]"></el-input>
        <el-select v-else-if="attrType(attr, 'select')" v-model="model[attr.name]" filterable >
          <el-option v-for="item in attr.options" :key="item.key" :label="item.value" :value="item.key">
          </el-option>
        </el-select>
        <el-date-picker v-else-if="attrType(attr, 'time')" v-model="model[attr.name]" type="datetime"></el-date-picker>
        <el-rate v-else-if="attrType(attr, 'rate')" style="margin-top:8px;" v-model="model[attr.name]" :colors="attr.colors" :max='attr.max'></el-rate>
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
      model: {}
    }
  },
  created() {
    this.model = _.cloneDeep(this.formData || {})
  },
  watch: {
    formData(data) {
      this.model = _.cloneDeep(data || {})
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  },
  methods: {
    attrType(attr, type) {
      const attrType = attr.type || 'input'
      return attrType === type
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

