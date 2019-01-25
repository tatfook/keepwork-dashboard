<template>
  <!-- <teacher-cdkey-crud resource="TeacherCDKey"> </teacher-cdkey-crud> -->
    <base-crud resource="TeacherCDKey"> </base-crud>
</template>

<script>
// import TeacherCDKeyCRUD from './crud'
import BaseCRUD from '@/components/BaseCRUD'

export default {
  components: {
    // 'teacher-cdkey-crud': TeacherCDKeyCRUD
    'base-crud': BaseCRUD
  }
}
</script>
