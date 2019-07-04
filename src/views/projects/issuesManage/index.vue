<template>
  <!-- <issues-manage-crud resource="IssuesManage"> </issues-manage-crud> -->
  <base-crud resource="IssuesManage"> </base-crud>
</template>

<script>
import BaseCRUD from '@/components/BaseCRUD'

export default {
  components: {
    'base-crud': BaseCRUD
  }
}
</script>