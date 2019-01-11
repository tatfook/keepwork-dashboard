<template>
  <div>
    <base-crud resource="WebsiteSuspend"></base-crud>
  </div>
</template>

<script>
import WebsiteSuspend from './websiteSuspend'

export default {
  components: {
    'base-crud': WebsiteSuspend
  }
}
</script>
