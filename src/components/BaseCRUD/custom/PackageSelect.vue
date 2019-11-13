<template>
  <div class="package-select">
    <el-tree ref="packagesTree" @check="handleCheckChange" :default-expanded-keys="[0]" :data="tree" show-checkbox node-key="id">
    </el-tree>
  </div>
</template>

<script>
import { resourceCRUD } from '@/api/lesson'
import _ from 'lodash'

const packagesCRUD = resourceCRUD('package')
export default {
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      tree: [],
      packages: [],
      lessons: []
    }
  },
  watch: {
    value(value) {
      this.initPackageSelected(value)
    }
  },
  methods: {
    handleCheckChange(data, node) {
      const { checkedKeys, halfCheckedKeys } = node
      if (checkedKeys.length === 0) {
        return this.$emit('input', [])
      }
      if (checkedKeys.includes(0)) {
        return this.$emit('input', this.converLessonId(this.packages))
      }
      const checkedPackages = []
      const halfCheckedPackages = []
      this.packages.forEach(item => {
        if (checkedKeys.includes(item.packageId)) {
          checkedPackages.push(item)
        }
        if (halfCheckedKeys.includes(item.packageId)) {
          halfCheckedPackages.push(item)
        }
      })
      const _halfCheckedPackages = _.cloneDeep(halfCheckedPackages)
      _halfCheckedPackages.forEach(item => {
        item.lessons = item.lessons.filter(l =>
          checkedKeys.includes(l.lessonId)
        )
      })
      const finalCheckPackages = [...checkedPackages, ..._halfCheckedPackages]
      this.$emit('input', this.converLessonId(finalCheckPackages))
    },
    initPackageSelected(packages) {
      const keys = packages.reduce((arr, cur) => {
        const packageId = cur.packageId
        const lessons = Array.isArray(cur.lessons)
          ? cur.lessons.map(l => `${packageId}-${l.lessonId}`)
          : []
        arr.push(...lessons)
        return arr
      }, [])
      this.$refs.packagesTree.setCheckedKeys(keys)
    },
    converLessonId(packages) {
      const _packages = _.cloneDeep(packages)
      return _packages.map(item => {
        item.lessons = item.lessons.map(l => {
          const lessonId = Number(l.lessonId.split('-')[1])
          return {
            ...l,
            lessonId
          }
        })
        return item
      })
    }
  },
  async mounted() {
    const params = {
      where: { state: { $eq: 2 }},
      include: [
        {
          as: 'packageLessons',
          $model$: 'PackageLesson',
          attributes: ['id', 'lessonNo'],
          include: [
            { as: 'lessons', $model$: 'Lesson', attributes: ['lessonName', 'id'] }
          ]
        }
      ],
      order: [],
      limit: 200,
      offset: 0
    }
    const res = await packagesCRUD.list(params)
    const rows = res.rows
    const packages = rows.map(p => {
      const packageName = p.packageName
      const packageId = p.id
      const lessons = p.packageLessons
        .filter(item => item.lessons)
        .map(l => ({
          id: `${packageId}-${l.lessons.id}`,
          label: l.lessons.lessonName,
          lessonNo: l.lessonNo
        }))
      return {
        id: packageId,
        label: packageName,
        children: _.sortBy(lessons, item => item.lessonNo)
      }
    })

    this.packages = rows.map(p => {
      const packageId = p.id
      const lessons = p.packageLessons
        .filter(i => i.lessons)
        .map(l => ({
          lessonId: `${packageId}-${l.lessons.id}`,
          lessonNo: l.lessonNo
        }))
      return {
        packageId,
        lessons: _.sortBy(lessons, item => item.lessonNo)
      }
    })
    this.tree = [{ id: 0, label: '全选', children: packages }]
    this.initPackageSelected(this.value)
  }
}
</script>

<style>
.package-select {
  height: 300px;
  overflow: auto;
}
</style>
