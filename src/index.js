#!/usr/bin/env node
/* eslint-disable no-console */

import fs from 'node:fs'
import https from 'node:https'
import path from 'node:path'
import process from 'node:process'
import readline from 'node:readline'
import axios from 'axios'

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
})
const rootUrl = process.argv[2]
const apiUrl = `${rootUrl}/i18n-json`
const appName = process.argv[3]
const expand = process.argv[4] === 'expand' ? '&expand=1' : ''
const split = process.argv[5] === 'split'

if (!rootUrl || !appName) {
  throw new Error('rootUrl 和 appName 都必须通过命令行参数传入')
}

instance(`${apiUrl}?app_name=${appName}${expand}`).then((response) => {
  const data = response.data

  const filePath = path.resolve(process.cwd(), 'src/locales/i18n.json')
  const dirPath = path.dirname(filePath)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  if (split) {
    const existingFiles = []
    Object.keys(data).forEach((key) => {
      const file = path.resolve(dirPath, `${key}.json`)
      if (fs.existsSync(file)) {
        existingFiles.push(`${key}.json`)
      }
    })

    if (existingFiles.length > 0) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })
      rl.question(`以下文件已存在，是否覆盖？(y/n): \r\n ${existingFiles.join(', ')}\r\n`, (answer) => {
        if (answer.toLowerCase() === 'y') {
          Object.keys(data).forEach((key) => {
            const fileContent = JSON.stringify(data[key], null, 2)
            const file = path.resolve(dirPath, `${key}.json`)
            fs.writeFileSync(file, fileContent)
            console.log(`${key}.json 文件已成功写入 src/locales 目录下。`)
          })
        }
        else {
          console.log('操作已取消。')
        }
        rl.close()
      })
    }
    else {
      Object.keys(data).forEach((key) => {
        const fileContent = JSON.stringify(data[key], null, 2)
        const file = path.resolve(dirPath, `${key}.json`)
        fs.writeFileSync(file, fileContent)
        console.log(`${key}.json 文件已成功写入 src/locales 目录下。`)
      })
    }
  }
  else {
    if (fs.existsSync(filePath)) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })
      rl.question('i18n.json 文件已存在，是否覆盖？(y/n): ', (answer) => {
        if (answer.toLowerCase() === 'y') {
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
          console.log('i18n.json 文件已成功写入 src/locales 目录下。')
        }
        else {
          console.log('操作已取消。')
        }
        rl.close()
      })
    }
    else {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
      console.log('i18n.json 文件已成功写入 src/locales 目录下。')
    }
  }
}).catch((error) => {
  console.error('写入 i18n.json 文件时发生错误:', error)
})
