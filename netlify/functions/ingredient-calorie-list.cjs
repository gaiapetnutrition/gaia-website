const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'data', 'ingredient_calorie_list.json')

exports.handler = async function () {
  const body = fs.readFileSync(filePath, 'utf8')
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body,
  }
}
