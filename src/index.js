#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import process from 'process';

const rootUrl = process.argv[2];
const apiUrl = `${rootUrl}/i18n-json`;
const appName = process.argv[3];

if (!rootUrl || !appName) {
  throw new Error('rootUrl 和 appName 都必须通过命令行参数传入');
}

const response = await axios(`${apiUrl}?app_name=${appName}`);
const data = response.data;

fs.writeFileSync(path.resolve(process.cwd(), 'src/locales/i18n.json'), JSON.stringify(data, null, 2));
