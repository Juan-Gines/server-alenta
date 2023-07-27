import { errorLog } from '../../lib/errorlog.js'

// * Error handler end point

export default (error, req, res, next) => {
  errorLog(error, req)
  res
    .status(error?.status || 500)
    .json({ status: 'FAILED', data: { error: error?.message || error } })
}
