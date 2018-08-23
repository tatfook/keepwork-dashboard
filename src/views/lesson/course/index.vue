<template>
  <base-crud v-bind="resourceProps"> </base-crud>
</template>

<script>
import BaseCRUD from '@/components/BaseCRUD'
import { resourceCRUD } from '@/api/lesson'

const lessonAPI = resourceCRUD('lessons ')
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
        api: lessonAPI,
        attributes: [
          {
            name: 'id',
            edit: false,
            width: '100px'
          },
          {
            name: 'lessonName',
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
            name: 'goals'
          },
          {
            name: 'extra.coverUrl'
          },
          {
            name: 'extra.vedioUrl'
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
