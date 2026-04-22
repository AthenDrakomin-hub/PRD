import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '../exports');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const output = fs.createWriteStream(path.join(outputDir, `kforge-export-${Date.now()}.zip`));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', function() {
  console.log(`✅ 知识库导出完成，共 ${archive.pointer()} 字节`);
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// 添加 docs 和 02_网络隐匿 目录
if (fs.existsSync(path.join(__dirname, '../docs'))) {
  archive.directory(path.join(__dirname, '../docs'), 'docs');
}
if (fs.existsSync(path.join(__dirname, '../02_网络隐匿'))) {
  archive.directory(path.join(__dirname, '../02_网络隐匿'), '02_网络隐匿');
}
if (fs.existsSync(path.join(__dirname, '../05_实战笔记'))) {
  archive.directory(path.join(__dirname, '../05_实战笔记'), '05_实战笔记'); // 如果有自动生成的复盘笔记
}

try {
  const techItemsJson = fs.readFileSync(path.join(__dirname, '../src/data/techItems.generated.json'), 'utf8');
  archive.append(techItemsJson, { name: 'metadata.json' });
} catch (e) {
  console.log('未找到 metadata.json 数据，跳过添加');
}

archive.finalize();
