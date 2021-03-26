
import faker from 'faker'
import { xoaDau } from '../../utilities/stringHelpers'

const records = (time) => {
  let list = []
  for(let i = 1; i <=  1000; i++) {
    let item = {
      id: i,
      title: faker.name.jobTitle(),
      content: faker.lorem.text(),
      author: `${faker.name.firstName()} ${faker.name.lastName()}`,
      status: 'publish',
      createdAt: time,
      updatedAt: time
    }
    item.slug = `${xoaDau(item.title, '-')}-${i}`
    list.push(item)
  }
  return list
}

export default (time) => records(time)