import { errorLog } from '../../lib/errorlog.js'

// * Error handler end point

export default async (error, req, res, next) => {
  await errorLog(error, req)
  res
    .status(error?.status || 500)
    .json({ status: 'FAILED', data: { error: error?.message || error } })
}
