import { writeFile } from 'node:fs/promises';

const apiUrl = process.env.CONVESTIGATE_API_URL;
if (!apiUrl || !/^https:\/\//i.test(apiUrl)) {
  throw new Error('CONVESTIGATE_API_URL must be set to the deployed HTTPS API URL.');
}

await writeFile(
  new URL('../frontend/config.js', import.meta.url),
  `globalThis.CONVESTIGATE_API_URL = ${JSON.stringify(apiUrl.replace(/\/$/, ''))};\n`,
  'utf8'
);

console.log('Configured frontend API endpoint.');
