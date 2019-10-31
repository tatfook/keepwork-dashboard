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
      <el-transfer class="project-sort-main-transfer" v-model="sortIDs" filterable :left-default-checked="[]" :right-default-checked="[]" :titles="['不排序的项目', '参与排序的项目']" :button-texts="['移出排序', '参与排序']" :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }" @change="handleChange" :data="transferData">
        <span slot-scope="{ option }">{{ option.label }}</span>
      </el-transfer>

      <div class="project-sort-main-right">
        <div class="project-sort-main-right-header">
          <span>排序</span>
          <el-button :loading="loading" @click="bulkSortProject" size="mini" type="success" round>更新</el-button>
        </div>
        <div class="project-sort-main-right-title">
          <span class="project-sort-main-right-title-left">
            序号
          </span>
          <span class="project-sort-main-right-title-right">
            项目名称
          </span>
        </div>
        <div class="draggable-list">
          <div class="draggable-list-serial">
            <div v-for="(item, index) in sortList" :key="index" class="draggable-list-serial-number">
              {{index + 1}}
            </div>
          </div>
          <div class="draggable-list-projects">
            <draggable v-model="sortList">
              <div class="project-sort-main-right-sort-item" v-for="(item) in sortList" :key="item.id">
                <span> id: {{item.id}} - {{item.name}}</span> <span class="sort-item-operation">
                  <el-tooltip content="移到顶部" placement="left">
                    <i @click="sortToTop(item.id)" class="el-icon-top sort-item-operation-icon"></i>
                  </el-tooltip>
                  <el-tooltip content="移到底部" placement="right">
                    <i @click="sortToBottom(item.id)" class="el-icon-bottom sort-item-operation-icon"></i>
                  </el-tooltip>
                </span>
              </div>
            </draggable>
          </div>
        </div>
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
      sortList: [],
      loading: false,
      toRemoveSortList: []
    }
  },
  watch: {
    sortIDs(arr) {
      const projects = this.tagProjects.filter(item => arr.includes(item.id))
      const _projects = projects.map(item => ({
        name: item.name,
        id: item.id,
        sn: _.get(item, 'systemTags[0].systemTagProjects.sn', '')
      }))
      this.sortList = _.sortBy(_projects, item => item.sn)
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
      this.transferData = rows.map(item => ({
        label: `id:${item.id} - ${item.name}`,
        key: item.id
      }))
      let sortProjects = _.reduce(
        rows,
        (arr, cur) => {
          const projectSN = _.get(cur, 'systemTags[0].systemTagProjects.sn', '')
          if (projectSN) {
            arr.push({ id: cur.id, sn: projectSN })
          }
          return arr
        },
        []
      )
      sortProjects = _.sortBy(sortProjects, item => item.sn)
      this.sortIDs = _.map(sortProjects, p => p.id)
      return rows
    },
    async bulkSortProject() {
      try {
        this.loading = true
        await this.removeNoSortProject()
        await Promise.all(
          this.sortList.map((p, i) => this.sortProject(p.id, i + 1))
        )
        this.$message.success('更新成功')
        await this.getTagProjects()
      } catch (error) {
        console.error(error)
        this.$message.error('更新失败')
      } finally {
        this.loading = false
      }
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
    sortToTop(id) {
      const sortProject = _.find(this.sortList, p => p.id === id)
      const otherProject = _.filter(this.sortList, p => p.id !== id)
      this.sortList = [sortProject, ...otherProject]
    },
    sortToBottom(id) {
      const sortProject = _.find(this.sortList, p => p.id === id)
      const otherProject = _.filter(this.sortList, p => p.id !== id)
      this.sortList = [...otherProject, sortProject]
    },
    async removeNoSortProject() {
      await Promise.all(this.toRemoveIDs.map(id => this.sortProject(id, 0)))
    },
    handleChange(value, direction, movedKeys) {
      if (direction === 'left') {
        this.toRemoveSortList = _.concat(this.toRemoveSortList, movedKeys)
      }
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
    },
    toRemoveIDs() {
      const uniqArr = _.uniq(this.toRemoveSortList)
      const finalRemoveIDs = _.filter(uniqArr, id => !this.sortIDs.includes(id))
      return finalRemoveIDs
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

    &-transfer {
      text-align: left;
      margin-right: 160px;
    }
    &-right {
      min-width: 300px;
      &-title {
        background: #ebeef5;
        height: 42px;
        line-height: 42px;
        margin: 10px 0;
        &-left {
          display: inline-block;
          width: 50px;
          text-align: center;
          border-right: 1px solid #dcdfe6;
        }
        &-right {
          padding-left: 8px;
        }
      }
      .draggable-list {
        display: flex;
        &-serial {
          width: 50px;
          &-number {
            height: 42px;
            line-height: 42px;
            text-align: center;
            margin-bottom: 10px;
            background: #00adb5;
            color: #fff;
          }
        }
        &-projects {
          flex: 1;
        }
      }
      &-header {
        height: 50px;
        line-height: 50px;
        padding: 0 10px;
        display: flex;
        background: #5f6769;
        border-radius: 4px;
        color: #fff;
        justify-content: space-between;
        align-items: center;
      }

      &-sort-item {
        background: #ebeef5;
        height: 42px;
        line-height: 42px;
        padding: 0 12px;
        margin-bottom: 10px;
        cursor: move;
        border-radius: 2px;
        display: flex;
        justify-content: space-between;
        .sort-item-operation {
          opacity: 0;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          &-icon {
            margin-left: 6px;
          }
        }
        &:hover {
          .sort-item-operation {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>