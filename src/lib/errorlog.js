import fs from 'node:fs/promises'

export const errorLog = async (error, req) => {
  const now = Date.now()
  const date = new Date(now)
  await fs.appendFile(`./src/logs/errors${(date.getMonth() + 1)}${date.getFullYear()}.txt`,
  `${date.toLocaleDateString()} status: ${error.status} ${JSON.stringify(error)} \nip: ${req.ip} method: ${req.method} url: ${req.originalUrl} \nbody: ${JSON.stringify(req.body)} \nparams: ${JSON.stringify(req.params)} \nroute: ${JSON.stringify(req.route)}\n\n`)
}
