const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

const projectDir = path.resolve(__dirname, '..')
const distDir = path.resolve(projectDir, 'dist')

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true })
}

const srcDir = path.resolve(distDir, 'src')

fs.mkdirSync(srcDir, { recursive: true })

fs.cpSync(__dirname, srcDir, { recursive: true })

const output = fs.createWriteStream(path.join(distDir, 'bot.zip'))

const archive = archiver('zip', {
  zlib: { level: 9 }
})

archive.pipe(output)

archive.directory(distDir, false)

archive.finalize()

output.on('close', () => {
  console.log(`Archive created successfully: ${archive.pointer()} total bytes`)
})

archive.on('finish', () => {
  fs.rmSync(srcDir, { recursive: true, force: true })
})
