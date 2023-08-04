import UserModel from '#Models/user.js'
import { initialUsers } from './helpers/user.js'

describe('Posts', () => {
  beforeEach(async () => {
    await UserModel.deleteMany({})
    const newUser1 = new UserModel(initialUsers[0])
    await newUser1.save()
    const newUser2 = new UserModel(initialUsers[1])
    await newUser2.save()
  })
})
