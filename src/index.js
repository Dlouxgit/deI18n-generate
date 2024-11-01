#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import axios from 'axios'

const rootUrl = process.argv[2]
const apiUrl = `${rootUrl}/i18n-json`
const appName = process.argv[3]
const expand = process.argv[4] === 'expand' ? '&expand=1' : ''

if (!rootUrl || !appName) {
  throw new Error('rootUrl 和 appName 都必须通过命令行参数传入')
}

axios(`${apiUrl}?app_name=${appName}${expand}`).then((response) => {
  const data = response.data

  const filePath = path.resolve(process.cwd(), 'src/locales/i18n.json')
  const dirPath = path.dirname(filePath)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  // eslint-disable-next-line no-console
  console.log('i18n.json 文件已成功写入 src/locales 目录下。')
}).catch((error) => {
  console.error('写入 i18n.json 文件时发生错误:', error)
})
