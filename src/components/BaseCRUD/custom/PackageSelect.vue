<template>
  <div class="package-select">
    <el-tree :default-expanded-keys="[0]" :data="tree" show-checkbox node-key="id">
    </el-tree>
  </div>
</template>

<script>
import { resourceCRUD } from '@/api/lesson'

const packagesCRUD = resourceCRUD('packages')
export default {
  props: {
    value: []
  },
  data() {
    return {
      tree: []
    }
  },
  async mounted() {
    const params = {
      where: {},
      include: [{ all: true, nested: true }],
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
          id: l.lessons.id,
          label: l.lessons.lessonName
        }))
      return {
        id: packageId,
        label: packageName,
        children: lessons
      }
    })
    this.tree = [{ id: 0, label: '全选', children: packages }]
  }
}
</script>

<style>
.package-select {
  height: 300px;
  overflow: auto;
}
</style>
