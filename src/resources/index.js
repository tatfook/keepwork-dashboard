import _ from 'lodash'
import User from './user'
import Subject from './subject'
import Skill from './skill'
import Package from './package'
import Lesson from './lesson'

export const resources = {
  User,
  Subject,
  Skill,
  Package,
  Lesson
}

export const newResource = (name, row) => {
  const Klass = resources[_.capitalize(name)]
  if (!Klass) throw new Error('Invlid resource: ' + name)
  return new Klass(row)
}

export default {
  resources,
  newResource
}
