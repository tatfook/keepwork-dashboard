<template>
  <base-crud v-bind="resourceProps"> </base-crud>
</template>

<script>
import BaseCRUD from '@/components/BaseCRUD'
import { resourceCRUD } from '@/api/lesson'

const packageAPI = resourceCRUD('packages')
const subjectAPI = resourceCRUD('subjects')
const userAPI = resourceCRUD('users')

export default {
  data() {
    return {
      subjectOptions: [],
      subjectMap: {}
    }
  },
  async created() {
    await this.loadSubjectOptions()
  },
  methods: {
    async loadSubjectOptions() {
      try {
        const list = await subjectAPI.list()
        this.subjectOptions = list.rows.map(item => {
          return {
            key: item.id,
            name: item.subjectName
          }
        })
      } catch (err) {
        console.error(err)
      }
    }
  },
  computed: {
    resourceProps() {
      return {
        api: packageAPI,
        attributes: [
          {
            name: 'id',
            edit: false,
            width: '100px'
          },
          {
            name: 'packageName',
            required: true
          },
          {
            name: 'userId',
            required: true,
            edit: false
          },
          {
            name: 'subjectId',
            required: true,
            type: 'select',
            options: this.subjectOptions
          },
          {
            name: 'minAge',
            required: true
          },
          {
            name: 'maxAge',
            required: true
          },
          {
            name: 'state',
            required: true,
            filter: (value) => {
              const map = {
                0: '新创建',
                1: '审核中',
                2: '审核通过',
                3: '审核失败',
                4: '异常'
              }
              return map[value]
            }
          },
          {
            name: 'rmb',
            required: true
          },
          {
            name: 'coin',
            required: true
          },
          {
            name: 'createdAt',
            edit: false
          }
        ],
        actions: {
          disabled: ['show']
        },
        nested: [
          {
            name: 'userId',
            api: userAPI,
            attr: 'username'
          },
          {
            name: 'subjectId',
            api: subjectAPI,
            attr: 'subjectName'
          }
        ]
      }
    }
  },
  components: {
    'base-crud': BaseCRUD
  }
}
</script>
