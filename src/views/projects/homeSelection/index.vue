<template>
  <base-crud resource="HomeSelection"> </base-crud>
</template>

<script>
import HomeSelection from './homeSelection'

export default {
  components: {
    'base-crud': HomeSelection
  }
}
</script>