<template>
  <div class="project-sort">
    <div class="project-sort-header">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          当前标签： {{currentTagName}}<i class="cursor el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in tags" :command="item.id" :key="item.id">{{item.tagname}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div class="project-sort-main">
      <el-transfer style="text-align: left; display: inline-block" v-model="sortIDs" filterable :left-default-checked="[]" :right-default-checked="[]" :titles="['不排序列表', '排序列表']" :button-texts="['退出排序', '参与排序']" :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }" @change="handleChange" :data="transferData">
        <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
      </el-transfer>

      <div class="project-sort-main-sort">
        <div class="project-sort-main-sort-header">
          <span>排序的项目</span>
          <el-button @click="bulkSortProject" size="mini" type="success" round>更新</el-button>
        </div>
        <draggable v-model="sortList">
          <div class="project-sort-main-sort-item" v-for="(item, index) in sortList" :key="item.id">
            {{index + 1}} - {{item.name}}
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import systemTagsModel from '@/models/systemTags'
import projectsManageModel from '@/models/projectsManage'
import createService from '@/utils/request'
import _ from 'lodash'
const systemTags = systemTagsModel()
const projectsCRUD = projectsManageModel()
const request = createService()
export default {
  name: 'ProjectsSort',
  components: {
    draggable
  },
  data() {
    return {
      tags: [],
      tagProjects: [],
      selectedTagID: '',
      transferData: [],
      sortIDs: [],
      sortList: []
    }
  },
  watch: {
    sortIDs(arr) {
      const projects = this.tagProjects.filter(item => arr.includes(item.id))
      this.sortList = projects.map(item => ({
        name: item.name,
        id: item.id,
        sn: item.sn
      }))
    },
    sortList(arr) {
      console.log(arr)
    }
  },
  async created() {
    const params = {
      include: [],
      limit: 100,
      offset: 0,
      order: [],
      where: {
        classify: {
          $eq: 1
        }
      }
    }
    const { rows = [] } = await systemTags.list(params)
    this.tags = rows
    this.selectedTagID = this.routeTagID || _.get(rows, '[0].id', '')
    await this.getTagProjects(this.selectedTagID)
  },
  methods: {
    async handleCommand(id) {
      this.selectedTagID = id
      await this.getTagProjects(id)
      this.$router.push({
        query: {
          id
        }
      })
    },
    async getTagProjects(id) {
      const { rows } = await projectsCRUD.list({
        where: {},
        include: [
          {
            $model$: 'systemTags',
            nest: false,
            where: {
              id
            }
          }
        ],
        offset: 0,
        limit: 100
      })
      this.tagProjects = rows
      this.transferData = rows.map(item => ({ label: item.name, key: item.id }))
      return rows
    },
    async bulkSortProject() {
      console.log(this.sortList)
      await Promise.all([
        this.sortList.map((p, i) => this.sortProject(p.id, i))
      ])
    },
    sortProject(projectId, sn) {
      return request({
        method: 'PUT',
        url: `/admins/projects/${projectId}/systemTags/${this.selectedTagID}`,
        data: {
          sn
        }
      })
    },
    handleChange(value, direction, movedKeys) {
      console.log({
        value,
        direction,
        movedKeys
      })
    }
  },
  computed: {
    routeTagID() {
      return _.toNumber(_.get(this.$route, 'query.id', ''))
    },
    currentTagName() {
      return _.get(
        _.find(this.tags, item => item.id === this.selectedTagID),
        'tagname',
        ''
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.project-sort {
  padding: 20px 50px;
  .cursor {
    cursor: pointer;
  }

  &-header {
    background: #ebeef5;
    padding: 10px 20px;
  }
  &-main {
    padding-top: 20px;
    display: flex;

    &-sort {
      &-header {
        padding: 10px;
        display: flex;
        background: #909399;
        border-radius: 4px;
        color: #fff;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      width: 300px;
      margin-left: 160px;
      &-item {
        background: #ebeef5;
        padding: 10px;
        margin-bottom: 10px;
        cursor: move;
        border-radius: 2px;
      }
    }
  }
}
</style>