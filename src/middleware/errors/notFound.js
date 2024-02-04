// * Not found end point

export default async (req, res, next) => {
  res.status(404).json({
    status: 'FAILED',
    data: { error: 'No se ha encontrado esta ruta.' }
  })
}
