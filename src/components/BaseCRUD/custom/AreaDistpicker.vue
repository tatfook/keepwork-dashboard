<template>
  <div class="area-distpicker">
    <v-distpicker :province="defaultProvince" :city="defaultCity" :area="defaultArea" @selected="handleFinish"></v-distpicker>
  </div>
</template>

<script>
import VDistpicker from 'v-distpicker'
export default {
  name: 'AreaDistpicker',
  components: {
    VDistpicker
  },
  props: {
    value: ''
  },
  data() {
    return {
      selectedProvince: '',
      selectedCity: '',
      selectedArea: '',
      defaultProvince: '',
      defaultCity: '',
      defaultArea: ''
    }
  },
  watch: {
    value(value) {
      this.initSelected(value)
    }
  },
  mounted() {
    this.initSelected(this.value)
  },
  methods: {
    handleFinish(obj) {
      const selectedArea = [obj.province.value, obj.city.value, obj.area.value].join(',')
      this.$emit('input', selectedArea)
    },
    initSelected(value) {
      const [province = '', city = '', area = ''] = value.split(',')
      this.defaultProvince = province
      this.defaultCity = city
      this.defaultArea = area
    }
  }
}
</script>

