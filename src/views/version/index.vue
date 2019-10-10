<template>
  <div class="release-version">
    <el-table :data="tableData" border>
      <el-table-column prop="version" label="当前版本" width="90">
      </el-table-column>
      <el-table-column prop="window_install" label="window安装版">
      </el-table-column>
      <el-table-column prop="window_zip" label="window U盘免安装版">
      </el-table-column>
      <el-table-column prop="sp3" label="window XP SP3版本">
      </el-table-column>
      <el-table-column prop="mac" label="苹果应用商店">
      </el-table-column>
      <el-table-column prop="android_apk" label="Android版手机APK安装包">
      </el-table-column>
      <el-table-column prop="android_huawei" label="Android版华为应用商城">
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible">
      <el-form ref="form" :model="form">
        <el-form-item label="当前版本">
          <el-input v-model="form.version"></el-input>
        </el-form-item>
        <el-form-item label="window安装版">
          <el-input v-model="form.window_install"></el-input>
        </el-form-item>
        <el-form-item label="window U盘免安装版">
          <el-input v-model="form.window_zip"></el-input>
        </el-form-item>
        <el-form-item label="window XP SP3版本">
          <el-input v-model="form.sp3"></el-input>
        </el-form-item>
        <el-form-item label="苹果应用商店">
          <el-input v-model="form.mac"></el-input>
        </el-form-item>
        <el-form-item label="Android版手机APK安装包">
          <el-input v-model="form.android_apk"></el-input>
        </el-form-item>
        <el-form-item label="Android版华为应用商城">
          <el-input v-model="form.android_huawei"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="isLoading" @click="handleUpdate">更 新</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDownloadUrl, updateDownloadUrl } from '@/api/version'
import _ from 'lodash'
export default {
  name: 'ReleaseVersion',
  async mounted() {
    await this.initDownloadUrl()
  },
  methods: {
    handleEdit(data) {
      this.dialogVisible = true
      this.form = _.clone(data)
    },
    async handleUpdate() {
      try {
        this.isLoading = true
        await updateDownloadUrl(this.form)
        await this.initDownloadUrl()
        this.isLoading = false
        this.dialogVisible = false
        this.$message.success('更新成功')
      } catch (error) {
        this.isLoading = false
        console.error(error)
        this.$message.error('更新失败')
      }
    },
    async initDownloadUrl() {
      const res = await getDownloadUrl()
      this.tableData = [res]
    }
  },
  computed: {
    URL_KEYS() {
      return [
        'version',
        'window_install',
        'window_zip',
        'mac',
        'android_apk',
        'android_huawei',
        'sp3'
      ]
    }
  },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      form: {},
      isLoading: false
    }
  }
}
</script>


<style>
.release-version {
  padding: 20px;
}
</style>