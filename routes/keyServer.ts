/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import path = require('path')
import fs = require('fs')
import { type Request, type Response, type NextFunction } from 'express'

module.exports = function serveKeyFiles () {
  return ({ params }: Request, res: Response, next: NextFunction) => {
    const file = params.file

    const ROOT = path.resolve('encryptionkeys')
    const requestedPath = path.resolve(ROOT, file)
    let realPath
    try {
      realPath = fs.realpathSync(requestedPath)
    } catch (e) {
      res.status(404)
      next(new Error('File not found!'))
      return
    }
    if (realPath.startsWith(ROOT + path.sep)) {
      res.sendFile(realPath)
    } else {
      res.status(403)
      next(new Error('Access to the requested file is forbidden!'))
    }
  }
}
