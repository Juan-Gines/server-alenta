import { errorLog } from '../../lib/errorlog.js'

// * Not found end point

export default async (req, res, next) => {
  await errorLog({ status: 404, error: 'No se ha encontrado esta ruta.' }, req)
  res.status(404).json({
    status: 'FAILED',
    data: { error: 'No se ha encontrado esta ruta.' }
  })
}
