#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import axios from 'axios'

const rootUrl = process.argv[2]
const apiUrl = `${rootUrl}/i18n-json`
const appName = process.argv[3]

if (!rootUrl || !appName) {
  throw new Error('rootUrl 和 appName 都必须通过命令行参数传入')
}
axios(`${apiUrl}?app_name=${appName}`).then((response) => {
  const data = response.data

  const filePath = path.resolve(process.cwd(), 'src/locales/i18n.json')
  const dirPath = path.dirname(filePath)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
})
