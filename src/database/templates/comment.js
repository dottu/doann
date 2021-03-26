
import faker from 'faker'
import { xoaDau } from '../../utilities/stringHelpers'

const records = (time) => {
  let list = []
  for(let i = 1; i <=  5000; i++) {
    let item = {
      id: i,
      articleId: Math.ceil(i/10),
      contentMessage: faker.name.jobDescriptor(),
      guestName: `${faker.name.firstName()} ${faker.name.lastName()}`,
      status: 'publish',
      createdAt: time,
      updatedAt: time
    }
    if (i >= 15 && i%15===0) {
      item.parentGuestName = list[i-i].guestName
    }
    list.push(item)
  }
  return list
}

export default (time) => records(time)