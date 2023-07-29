import trimObj from '../../utils/trimObj.js'

const trimBody = (req, res, next) => {
  const { body } = req
  const bodyTrimed = trimObj(body)
  req.body = bodyTrimed
  next()
}

export default trimBody
