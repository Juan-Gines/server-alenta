export default (req, res, next) => {
  res.status(404).json({
    status: 'FAILED',
    message: 'No se ha encontrado esta ruta.'
  })
}
