<template>
  <div class="filter-container" v-if="haveSearchParams">
    <div class="filter" v-for="param in searchParams" :key="param">
      <el-button icon="el-icon-minus" size="mini" circle @click="removeFilter(param)"> </el-button>
      <span style="margin: 0px 10px; width: 120px; display: inline-block"> {{param}} </span>
      <el-select v-model="quries[param].op" :key="queryKey" @change="buildQueryKey">
        <el-option v-for="item in quries[param].options" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <el-input style="margin: 0px 10px; width: 300px" size="medium" v-model="quries[param].value"> </el-input>
    </div>
    <el-button icon="el-icon-search" type="primary" @click="handleSearch()"> Search </el-button>
  </div>
</template>

<script>
import _ from 'lodash'
import uuid from 'uuid'
import { getQueryOps, parseQuery } from './queryOps'

export default {
  name: 'CRUDFiler',
  props: {
    resourceClass: {
      required: true
    },
    searchParams: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      quries: {},
      queryKey: undefined
    }
  },
  created() {
    this.syncSearchParams()
  },
  watch: {
    searchParams(data) {
      this.syncSearchParams(data)
    }
  },
  methods: {
    buildQueryKey() {
      this.queryKey = uuid()
    },
    syncSearchParams(data) {
      data = data || this.searchParams
      const attrs = this.resourceClass.attributes()
      for (const filter of data) {
        if (!this.quries[filter]) {
          const index = _.findIndex(attrs, (attr) => attr.name === filter)
          const options = getQueryOps(attrs[index].type || 'String')
          this.quries[filter] = {
            name: filter,
            op: 'eq',
            options: options,
            value: ''
          }
        }
      }
      this.buildQueryKey()
    },
    removeFilter(filter) {
      this.$emit('removeFilter', filter)
      _.omit(this.quries, filter)
    },
    handleSearch() {
      const q = {}
      for (const filter in this.quries) {
        const data = this.quries[filter]
        if (data.value !== '') _.merge(q, parseQuery(data))
      }
      this.$emit('handleSearch', q)
    }
  },
  computed: {
    haveSearchParams() {
      return this.searchParams.length > 0
    }
  }
}
</script>

<style>
.filter-container {
  background-color: #eee;
  margin: 10px 0px;
  padding: 10px;
}
.filter {
  margin: 6px;
}
</style>
