<template>
  <div id="message-editor">
  </div>
</template>

<script>
import E from 'wangeditor'
const menus = [
  'head', // 标题
  'bold', // 粗体
  'fontSize', // 字号
  'italic', // 斜体
  'underline', // 下划线
  'strikeThrough', // 删除线
  'foreColor', // 文字颜色
  'link', // 插入链接
  'quote', // 引用
  'emoticon', // 表情
  'undo', // 撤销
  'redo' // 重复
]
export default {
  name: 'Editor',
  props: {
    value: ''
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.editor = new E('#message-editor')
    this.editor.customConfig.menus = menus
    this.editor.customConfig.onchange = html => this.$emit('input', html)
    this.editor.create()
    this.editor.txt.html(this.value)
  }
}
</script>

<style>

#message-editor .w-e-toolbar {
  flex-wrap: wrap;
}


</style>