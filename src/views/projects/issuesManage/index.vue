<template>
  <issues-manage-crud resource="IssuesManage"> </issues-manage-crud>
</template>

<script>
import IssuesManage from './issuesManage'

export default {
  components: {
    'issues-manage-crud': IssuesManage
  }
}
</script>