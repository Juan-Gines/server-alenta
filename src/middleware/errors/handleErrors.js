// * Error handler end point

export default async (error, req, res, next) => {
  res
    // .status(error?.status || 500)
    .json({ status: 'FAILED', data: { error: error?.message || error } })
}
