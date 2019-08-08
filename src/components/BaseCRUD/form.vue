<template>
  <div class="form-container">
    <el-form :rules="attrRules" ref="dataForm" :model="model" label-position="left" label-width="120px" style='width: 700px; margin-left:10px;'>
      <el-form-item v-for="attr in attrsWithModelPath" :key="attr.name" :label="i18n(attr.alias || attr.name)" :prop="attr.name">
        <input-link v-if="attrComponent(attr, 'link')" v-model="attr.model[attr.modelKey]" :attr="attr"></input-link>
        <el-select v-else-if="attr.associate" v-model="attr.model[attr.modelKey]" filterable remote :remote-method="searchAssociate(attr)" :loading="loading" :multiple="attr.multiple">
          <el-option v-for="item in associateOptions[attr.name]" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
        <el-input v-else-if="attrComponent(attr, 'input')" v-model="attr.model[attr.modelKey]" />
        <!-- <el-input v-else-if="attrComponent(attr, 'input')" v-model="attr.model[attr.modelKey]" /> -->
        <el-input v-else-if="attrComponent(attr, 'text')" v-model="attr.model[attr.modelKey]" type="textarea" />
        <el-select v-else-if="attrComponent(attr, 'select')" v-model="attr.model[attr.modelKey]">
          <el-option v-for="item in attr.options" :key="item.key" :label="item.value" :value="item.key">
          </el-option>
        </el-select>
        <el-date-picker v-else-if="attrComponent(attr, 'time')" v-model="attr.model[attr.modelKey]" type="datetime" />
        <el-rate v-else-if="attrComponent(attr, 'rate')" style="margin-top:8px;" v-model="attr.model[attr.modelKey]" :colors="attr.colors" :max='attr.max'></el-rate>
        <input-file v-else-if="attrComponent(attr, 'file')" v-model="attr.model[attr.modelKey]"></input-file>
        <input-org v-else-if="attrComponent(attr, 'org')" v-model.trim="attr.model[attr.modelKey]"></input-org>
        <package-select v-else-if="attrComponent(attr, 'package')" v-model="attr.model[attr.modelKey]"></package-select>
        <package-tags-checkbox v-else-if="attrComponent(attr, 'packageTags')" v-model="attr.model[attr.modelKey]"></package-tags-checkbox>
        <area-distpicker v-else-if="attrComponent(attr, 'areaDistpicker')" v-model="attr.model[attr.modelKey]"></area-distpicker>
        <editor v-else-if="attrComponent(attr, 'editor')" :status="status" v-model="attr.model[attr.modelKey]"></editor>
        <message-user-select v-else-if="attrComponent(attr, 'messageUserSelect')" v-model="attr.model[attr.modelKey]"></message-user-select>
        <work-add v-else-if="attrComponent(attr, 'workAdd')" v-model="model"></work-add>
        <p-block-add v-else-if="attrComponent(attr, 'pBlockAdd')" v-model="model"></p-block-add>
      </el-form-item>
    </el-form>
    <div slot="footer" class="form-footer">
      <el-button @click="cancel">{{$t('cancel')}}</el-button>
      <el-button v-if="status=='create'" type="primary" @click="createData">{{$t('save')}}</el-button>
      <el-button v-else type="primary" @click="updateData">{{$t('update')}}</el-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { getResourceClass } from '@/resources'
import { mapGetters } from 'vuex'
import { ActiveQuery } from '@/utils/query'
import InputFile from './custom/InputFile'
import InputOrg from './custom/InputOrg'
import InputLink from './custom/InputLink'
import PackageSelect from './custom/PackageSelect'
import PackageTagsCheckbox from './custom/PackageTagsCheckbox'
import AreaDistpicker from './custom/AreaDistpicker'
import Editor from './custom/Editor'
import MessageUserSelect from './custom/MessageUserSelect'
import WorkAdd from './custom/WorkAdd'
import pBlockAdd from './custom/pBlockAdd'

export default {
  name: 'CRUDFrom',
  props: {
    status: String,
    formData: Object
  },
  components: {
    InputFile,
    InputOrg,
    InputLink,
    PackageSelect,
    PackageTagsCheckbox,
    AreaDistpicker,
    Editor,
    MessageUserSelect,
    WorkAdd,
    pBlockAdd
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
    this.initModel()
  },
  watch: {
    formData(data) {
      this.initModel()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  },
  methods: {
    i18n(col) {
      return this.resourceClass.i18n(col)
    },
    attrComponent(attr, type) {
      const comp = attr.component || 'input'
      return comp === type
    },
    initModel() {
      this.model = _.cloneDeep(this.formData || {})
      if (this.status === 'create') {
        this.loadDefaultValues()
      }
      this.loadModelAssociate()
    },
    loadDefaultValues() {
      _.forEach(this.resourceClass.attributes(), attr => {
        if (
          (attr.required || attr.edit !== false) &&
          attr.default !== undefined
        ) {
          this.model[attr.name] = _.isFunction(attr.default)
            ? attr.default()
            : attr.default
        }
      })
    },
    async loadModelAssociate() {
      this.loading = true
      this.associateOptions = {}
      for (const attr of this.attrs) {
        if (attr.associate) {
          if (this.model[attr.name] && !attr.multiple && this.edit !== false) {
            const associateClass = getResourceClass(attr.associate)
            const item = await associateClass.api().get(this.model[attr.name])
            this.associateOptions[attr.name] = [
              {
                key: item.id,
                value: item[associateClass.title()]
              }
            ]
          } else if (
            this.model[attr.name] &&
            attr.multiple &&
            this.model[attr.name].length > 0
          ) {
            const associateClass = getResourceClass(attr.associate)
            const queryOptions = new ActiveQuery()
              .where({ 'id-in': this.model[attr.name] })
              .paginate(1, 20).query
            const list = await associateClass.api().list(queryOptions)
            this.associateOptions[attr.name] = list.rows.map(item => {
              return {
                key: item.id,
                value: item[associateClass.title()]
              }
            })
          } else {
            await this.searchAssociate(attr)('')
          }
        }
      }
      this.loading = false
    },
    searchAssociate(attr) {
      const self = this
      const associateClass = getResourceClass(attr.associate)
      return async param => {
        this.loading = true
        let queryParam = {}
        if (param !== '') {
          const query = associateClass.queryFilter(new ActiveQuery())
          queryParam = query
            .where({ [associateClass.title() + '-like']: param + '%' })
            .paginate(1, 50).query
        }
        const list = await associateClass
          .api()
          .list({ ...queryParam, limit: 300 })
        self.associateOptions[attr.name] = list.rows.map(item => {
          return {
            key: item.id,
            value: item[associateClass.title()]
          }
        })
        this.loading = false
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
    ...mapGetters({
      resourceClass: 'resourceClass'
    }),
    attrs() {
      return this.resourceClass.editableAttrs()
    },
    attrsWithModelPath() {
      return _.map(this.attrs, attr => {
        const self = this
        return {
          ...attr,
          model: attr.isNested ? self.model.extra : self.model,
          modelKey: attr.isNested ? attr.modelName : attr.name
        }
      })
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

