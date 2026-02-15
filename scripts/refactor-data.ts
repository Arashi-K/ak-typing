import fs from 'fs'
import path from 'path'


// words.json
const filePath = 'src/resources/data/words.json';
const oldWords: string[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const newWords: string[] = [...new Set(oldWords)].sort().sort((a, b) => a.length - b.length);
fs.writeFileSync(filePath, JSON.stringify(newWords, null, 2))


console.log('✅ data updated')
