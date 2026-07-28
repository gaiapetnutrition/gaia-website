import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const filePath = path.join(__dirname, 'data', 'aafco_dog_per_1000kcal.json')

export const handler = async function () {
  const body = fs.readFileSync(filePath, 'utf8')
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body,
  }
}
