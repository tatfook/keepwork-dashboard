<template>
  <span class="work-add">
    <div class="work-add-item">
      <span class="work-add-item-label">大赛名称：</span>
      <el-select v-model="workData.gameName" placeholder="请选择" @change="changeOption">
        <el-option v-for="item in gameNameOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="work-add-item">
      <span class="work-add-item-label">期号：</span>
      <el-select v-model="workData.issueNum" placeholder="请选择">
        <el-option v-for="item in issueNumOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="work-add-item">
      <span class="work-add-item-label">项目ID：</span>
      <input class="work-add-item-input" v-model="workData.projectId" />
    </div>
    <div class="work-add-item">
      <span class="work-add-item-label">作品主题：</span>
      <el-select v-model="workData.workTheme" placeholder="请选择">
        <el-option v-for="item in workThemeOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="work-add-item">
      <span class="work-add-item-label">提交人姓名：</span>
      <input class="work-add-item-input" v-model="workData.submitter" />
    </div>
    <span class="work-add-item">
      <span class="work-add-item-label">学校/机构：</span>
      <input class="work-add-item-input" v-model="workData.school" />
    </span>
    <div class="work-add-item">
      <span class="work-add-item-label">获奖情况：</span>
      <el-select v-model="workData.reward" placeholder="请选择">
        <el-option v-for="item in rewardOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
  </span>
</template>
<script>
import { resourceCRUD } from '@/api/keepwork'
import _ from 'lodash'
const gameCRUD = resourceCRUD('games')

export default {
  name: 'WorkAdd',
  props: {
    value: Object
  },
  async created() {
    await this.getGameNameList()
    if (this.value) {
      console.log('this.value', this.value)
      this.workData.gameName = this.value.games.type
      this.workData.issueNum = this.value.games.no
      this.workData.projectId = this.value.projectId
      this.workData.workTheme = this.value.worksSubject
      this.workData.submitter = this.value.projects.users.userinfos.name
      this.workData.school = this.value.projects.users.userinfos.school
      this.workData.reward = this.value.reward
    }
  },
  data() {
    return {
      gameNameOptions: [],
      gameGroup: {},
      rewardOptions: [
        {
          value: '一等奖',
          label: '一等奖'
        },
        {
          value: '二等奖',
          label: '二等奖'
        },
        {
          value: '三等奖',
          label: '三等奖'
        },
        {
          value: '人气奖',
          label: '人气奖'
        }
      ],
      workData: {
        gameName: '',
        issueNum: '',
        projectId: '',
        submitter: '',
        school: '',
        workTheme: '',
        reward: ''
      }
    }
  },
  watch: {
    workData: {
      handler: function(val, oldVal) {
        const data = {
          games: {
            name: this.workData.gameName,
            no: this.workData.issueNum
          },
          id: this.value.id,
          projects: {
            id: this.workData.projectId,
            users: {
              userinfos: {
                name: this.workData.submitter,
                school: this.workData.school
              }
            }
          },
          worksSubject: this.workData.workTheme,
          reward: this.workData.reward
        }
        console.log('inputData', data)
        this.$emit('input', data)
      },
      deep: true
    }
  },
  computed: {
    issueNumOptions() {
      return this.gameName !== ''
        ? _.map(this.gameGroup[this.workData.gameName], item => ({
          label: item.no,
          value: item.no
        }))
        : []
    },
    workThemeOptions() {
      if (this.workData.gameName === 0) {
        // NPL大赛
        return [
          {
            value: '动画',
            label: '动画'
          },
          {
            value: '游戏',
            label: '游戏'
          },
          {
            value: '解谜',
            label: '解谜'
          }
        ]
      }
      if (this.workData.gameName === 1) {
        // 全国青少年科技创新大赛
        return [
          {
            value: '计算机科学',
            label: '计算机科学'
          }
        ]
      }
      if (this.workData.gameName === 2) {
        // 全国青少年科学影像节
        return [
          {
            value: '科普动画',
            label: '科普动画'
          }
        ]
      }
      if (this.workData.gameName === 3) {
        // 全国中小学信息技术创新与实践活动参赛作品
        return [
          {
            value: '动画创作',
            label: '动画创作'
          },
          {
            value: '微视频创作',
            label: '微视频创作'
          },
          {
            value: '移动端网页创作',
            label: '移动端网页创作'
          },
          {
            value: '3D智能作品创作',
            label: '3D智能作品创作'
          }
        ]
      }
      return []
    }
  },
  methods: {
    async getGameNameList() {
      const res = await gameCRUD.list()
      this.gameGroup = _.groupBy(res.rows, 'type')
      this.gameNameOptions = _.map(this.gameGroup, item => ({
        label: item[0].name,
        value: item[0].type
      }))
    },
    changeOption(val) {
      this.workData.issueNum = ''
      this.workData.workTheme = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.work-add {
  &-item {
    margin: 10px 0;
    &-label {
      display: inline-block;
      width: 120px;
      text-align: right;
      padding-right: 10px;
    }
    &-input {
      height: 40px;
      width: 200px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      padding-left: 15px;
    }
  }
}
</style>


