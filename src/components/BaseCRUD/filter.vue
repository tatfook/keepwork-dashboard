<template>
  <div class="filter-container" v-if="haveSearchParams">
    <div style="margin: 6px;" v-for="filter in quries" :key="filter.name">
      <el-button icon="el-icon-minus" size="mini" circle @click="removeFilter(filter.name)"> </el-button>
      <span style="width: 120px; display: inline-block"> {{filter.name}} </span>
      <el-select style="margin: 0px 10px" v-model="filter.op">
        <el-option v-for="item in filter.options" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <el-date-picker v-if="filter.type=='Date'" style="width: 300px" type="datetime" v-model="filter.value"></el-date-picker>
      <el-input v-else style="width: 300px" size="medium" v-model="filter.value"> </el-input>
    </div>
    <el-button icon="el-icon-search" type="primary" @click="handleSearch()"> Search </el-button>
  </div>
</template>

<script>
import _ from 'lodash'
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
      quries: {}
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
    syncSearchParams(data) {
      data = data || this.searchParams
      const attrs = this.resourceClass.attributes()
      const newQueries = _.cloneDeep(this.quries)
      for (const filter of data) {
        if (!newQueries[filter]) {
          const index = _.findIndex(attrs, attr => attr.name === filter)
          const type = attrs[index].type || 'String'
          const options = getQueryOps(type)
          newQueries[filter] = {
            name: filter,
            op: 'eq',
            value: '',
            type,
            options
          }
        }
      }
      this.quries = newQueries
    },
    removeFilter(filter) {
      this.$emit('removeFilter', filter)
      this.quries = _.omit(this.quries, filter)
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
</style>
