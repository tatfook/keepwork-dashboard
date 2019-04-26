<template>
  <base-crud resource="Admin"> </base-crud>
</template>

<script>
import BaseCRUD from '@/components/BaseCRUD'
import { mapGetters } from 'vuex'
export default {
  components: {
    'base-crud': BaseCRUD
  },
  computed: {
    ...mapGetters(['isAdmin'])
  },
  created() {
    if (!this.isAdmin) {
      this.$router.push({ path: '/404' })
    }
  }
}
</script>
