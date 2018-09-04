import _ from 'lodash'
import User from './user'
import Role from './role'
import TeacherCDKey from './teacherCDKey'
import Subject from './subject'
import Skill from './skill'
import Package from './package'
import Lesson from './lesson'
import PackageLesson from './packageLesson'
import HotPackage from './hotPackage'

export const resources = {
  User,
  Role,
  TeacherCDKey,
  Subject,
  Skill,
  Package,
  Lesson,
  PackageLesson,
  HotPackage
}

export const newResource = (name, row) => {
  const Klass = resources[_.upperFirst(name)]
  if (!Klass) throw new Error('Invlid resource: ' + _.upperFirst(name))
  return new Klass(row)
}

export const getResourceClass = (name) => {
  return resources[_.upperFirst(name)]
}

export default {
  resources,
  newResource,
  getResourceClass
}
