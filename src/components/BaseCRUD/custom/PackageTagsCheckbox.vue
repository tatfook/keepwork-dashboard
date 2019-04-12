<template>
  <div class="package-tags-checkbox">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="checkList" @change="handleCheckedTagsChange">
      <el-checkbox v-for="tag in tags" :label="tag.id" :key="tag.id">{{tag.tagname}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import { resourceCRUD } from '@/api/keepwork'
const systemTagsCRUD = resourceCRUD('systemTags')
import _ from 'lodash'
export default {
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    async value(tagIDs) {
      this.initTagsCheck(tagIDs)
    },
    checkList(check) {
      this.$emit('input', check)
    }
  },
  data() {
    return {
      checkList: [],
      tags: [],
      isIndeterminate: false,
      checkAll: false
    }
  },
  async mounted() {
    await this.getPackageTags()
    this.initTagsCheck(this.value)
  },
  computed: {
    tagIDs() {
      return this.tags.map(item => item.id)
    }
  },
  methods: {
    async getPackageTags() {
      const params = {
        where: { classify: { $eq: 2 }},
        include: [{ all: true, nested: true }],
        order: [],
        limit: 200,
        offset: 0
      }
      const res = await systemTagsCRUD.list(params)
      this.tags = _.get(res, 'rows', [])
    },
    initTagsCheck(tagIDs) {
      this.checkList = tagIDs
      this.handleCheckedTagsChange(tagIDs)
    },
    handleCheckAllChange(val) {
      this.checkList = val ? this.tagIDs : []
      this.isIndeterminate = false
    },
    handleCheckedTagsChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.tags.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tags.length
    }
  }
}
</script>
