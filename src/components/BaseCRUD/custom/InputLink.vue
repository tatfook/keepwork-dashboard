<template>
  <div class="input-link">
    <el-select v-model="siteName" filterable remote :remote-method="searchAssociate(attr)" @change="handleChange" :loading="loading">
      <el-option v-for="item in associateOptions" :key="item.key" :label="`${item.username}\/${item.value}`" :value="item.key" />
    </el-select>
  </div>
</template>

<script>
import { getResourceClass } from '@/resources'
import { ActiveQuery } from '@/utils/query'
import _ from 'lodash'
export default {
  name: 'InputLink',
  data() {
    return {
      siteName: '',
      loading: false,
      associateOptions: []
    }
  },
  props: {
    value: {},
    attr: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('input', value)
    },
    loadModelAssociate() {
      this.searchAssociate(this.attr)('')
    },
    searchAssociate(attr) {
      const self = this
      const associateClass = getResourceClass(attr.associate)
      return async param => {
        this.loading = true
        let queryParam = {}
        if (param !== '') {
          const query = associateClass.queryFilter(new ActiveQuery())
          queryParam = query.where({ [associateClass.title() + '-like']: param + '%' }).paginate(1, 50).query
        }
        const list = await associateClass.api().list({ ...queryParam, limit: 300 })
        self.associateOptions = list.rows.map(item => {
          return {
            key: item.id,
            value: item[associateClass.title()],
            username: item.username
          }
        })
        self.associateOptions = _.sortBy(self.associateOptions, item => item.username)
        this.loading = false
      }
    }
  },
  created() {
    this.loadModelAssociate()
  }
}
</script>
