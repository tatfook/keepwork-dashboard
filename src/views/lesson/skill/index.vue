<template>
  <base-crud v-bind="resourceProps"> </base-crud>
</template>

<script>
import BaseCRUD from '@/components/BaseCRUD'
import { resourceCRUD } from '@/api/lesson'

export default {
  computed: {
    api() {
      return resourceCRUD('skills')
    },
    resourceProps() {
      return {
        api: this.api,
        attributes: [
          {
            name: 'id',
            edit: false,
            width: '100px'
          },
          {
            name: 'skillName',
            required: true
          },
          {
            name: 'createdAt',
            edit: false
          }
        ],
        actions: {
          disabled: ['show']
        }
      }
    }
  },
  components: {
    'base-crud': BaseCRUD
  }
}
</script>
