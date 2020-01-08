import choiceProjectsModel from '@/models/choiceProjects'
import BaseResource from './base'
import _ from 'lodash'

const choiceProjectsCRUD = choiceProjectsModel()
const privilegeMap = [
  {
    key: 1,
    value: '开启'
  },
  {
    key: 2,
    value: '关闭'
  }
]
const typeMap = [
  {
    key: 0,
    value: '网站项目'
  },
  {
    key: 1,
    value: 'paracraft项目'
  }
]

export default class ChoiceProjects extends BaseResource {
  static attributes() {
    return [
      {
        name: 'number',
        type: 'number',
        show: true,
        edit: false,
        search: false,
        sortable: false
      },
      {
        name: 'choicenessNo',
        type: 'Number',
        show: false,
        edit: false,
        search: false
      },
      {
        name: 'id',
        type: 'Number',
        show: true,
        edit: false,
        search: true
      },
      {
        name: 'name',
        type: 'String',
        edit: false,
        search: true
      },
      {
        name: 'type',
        type: 'Number',
        show: true,
        search: false,
        edit: false,
        options: typeMap,
        filter: (key) => {
          for (const item of typeMap) {
            if (item.key === key) {
              return item.value
            }
          }
          return key
        }
      },
      {
        name: 'privilege',
        type: 'Number',
        edit: false,
        show: false,
        search: false,
        options: privilegeMap,
        filter: (key) => {
          for (const item of privilegeMap) {
            const privilegeKey = key & 1
            if (privilegeKey !== 1) {
              return '关闭'
            } else {
              return item.value
            }
          }

          return key
        }
      },
      {
        name: 'userId',
        type: 'Number',
        edit: false,
        show: false,
        search: false
      },
      {
        name: 'username',
        type: 'String',
        edit: false,
        show: false,
        search: false
      },
      {
        name: 'createdAt',
        type: 'Date',
        show: false,
        edit: false,
        search: false
      },
      {
        name: 'updatedAt',
        type: 'Date',
        show: false,
        edit: false,
        search: false
      },
      {
        name: 'visibility',
        type: 'String',
        show: true,
        edit: false,
        search: false,
        filter(value) {
          return value > 0 ? '私有' : '公开'
        }
      },
      {
        name: 'classifyTags',
        type: 'String',
        show: false,
        edit: false,
        search: false
      }
    ]
  }

  static model() {
    return choiceProjectsCRUD
  }

  static actions() {
    return {
      disabled: ['create', 'show', 'edit', 'destroy', 'delete'],
      extra: [
        {
          name: 'set',
          button: 'danger',
          title(row) {
            return '取消首页精选'
          },
          async func(row, that) {
            await choiceProjectsCRUD.update({ ...row, choicenessNo: 1 })
          }
        },
        {
          name: 'top',
          button: 'success',
          title(row) {
            return '置顶'
          },
          async func(row, that) {
            const [allChoiceProjects, project] = await Promise.all([
              choiceProjectsCRUD.list({ where: {}}),
              choiceProjectsCRUD.get(row.id)
            ])
            const projects = allChoiceProjects.rows
            const topProject = _.maxBy(projects, p => p.choicenessNo)
            const topProjectId = topProject.choicenessNo + 1
            await choiceProjectsCRUD.update({ ...project, choicenessNo: topProjectId })
          }
        },
        {
          name: 'up',
          button: 'success',
          title(row) {
            return '上移'
          },
          async func(row, that) {
            const [projects, project] = await Promise.all([
              choiceProjectsCRUD.list({ where: {}}),
              choiceProjectsCRUD.get(row.id)
            ])
            const allChoiceProjects = projects.rows
            const index = _.findIndex(allChoiceProjects, p => p.id === row.id)
            if (index !== 0) {
              const prvProject = allChoiceProjects[index - 1]
              await Promise.all([
                choiceProjectsCRUD.update({ ...prvProject, choicenessNo: project.choicenessNo }),
                choiceProjectsCRUD.update({ ...project, choicenessNo: prvProject.choicenessNo })
              ])
            }
          }
        },
        {
          name: 'down',
          button: 'success',
          title(row) {
            return '下移'
          },
          async func(row, that) {
            const [projects, project] = await Promise.all([
              choiceProjectsCRUD.list({ where: {}}),
              choiceProjectsCRUD.get(row.id)
            ])
            const allChoiceProjects = projects.rows
            const index = _.findIndex(allChoiceProjects, p => p.id === row.id)
            if (index < allChoiceProjects.length - 1) {
              const nextProject = allChoiceProjects[index + 1]
              await Promise.all([
                choiceProjectsCRUD.update({ ...nextProject, choicenessNo: project.choicenessNo }),
                choiceProjectsCRUD.update({ ...project, choicenessNo: nextProject.choicenessNo })
              ])
            }
          }
        },
        {
          name: 'viewDetail',
          title() {
            return '查看详情'
          },
          func(project) {
            window.open(`https://keepwork.com/pbl/project/${project.id}`, '_blank')
          }
        }
      ]
    }
  }

  static buttons() {
    return {
      append: [
        {
          name: '添加首页精选',
          type: 'primary',
          refresh: false,
          checkSelected: false,
          async func(projects, that) {
            const params = {
              data: [
                {
                  label: '项目ID',
                  key: 'projectId',
                  value: ''
                }
              ],
              type: 'input',
              title: '添加首页精选(可批量添加，逗号隔开)',
              status: 'addHomeChoiceProject'
            }
            that.showDialog(params)
          }
        },
        {
          name: '取消首页精选',
          type: 'warning',
          async func(projects, that) {
            await that.$confirm('确认批量取消首页精选?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async() => {
              const cancelList = _.map(projects, project => choiceProjectsCRUD.update({ ...project, choicenessNo: 1 }))
              await Promise.all(cancelList)
            }).catch(err =>
              Promise.reject(err)
            )
          }
        }
      ],
      callback: {
        async addHomeChoiceProject(inputArr, that) {
          let projectIDs = _.get(_.find(inputArr, (item) => item.key === 'projectId'), 'value', '')
          if (projectIDs) {
            projectIDs = projectIDs.replace(/，/g, ',')
            const IDs = _.reverse(_.uniq(_.map(_.filter(_.split(projectIDs, ','), v => v), _.toNumber)))
            const [currentChoiceProjects, projects] = await Promise.all([
              choiceProjectsCRUD.list({ where: {}}),
              choiceProjectsCRUD.list({ where: { choicenessNo: { $gte: 0 }, id: { $in: IDs }}})
            ])
            const newProjects = _.get(projects, 'rows', [])
            if (currentChoiceProjects.count > 0) {
              const currentProjects = currentChoiceProjects.rows
              const topProject = _.maxBy(currentProjects, p => p.choicenessNo)
              const topProjectId = topProject.choicenessNo + 1
              if (newProjects.length) {
                const addProjects = _.map(newProjects, (project, index) =>
                  choiceProjectsCRUD.update({ ...project, choicenessNo: topProjectId + index })
                )
                await Promise.all(addProjects)
              }
            } else {
              const addProjects = _.map(newProjects, (project, index) =>
                choiceProjectsCRUD.update({ ...project, choicenessNo: 100 + index })
              )
              await Promise.all(addProjects)
            }
          }
        }
      }
    }
  }
}
