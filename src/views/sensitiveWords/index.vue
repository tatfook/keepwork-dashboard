<template>
  <sensitive-words-crud resource="SensitiveWords"></sensitive-words-crud>
</template>

<script>
import SensitiveWords from './sensitiveWords'

export default {
  components: {
    'sensitive-words-crud': SensitiveWords
  }
}
</script>
