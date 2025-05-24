const fs = require('fs');
const path = require('path');

console.log('Running post-build script to copy PWA files...');

// Функция для копирования файла
function copyFile(source, target) {
    try {
        const sourceExists = fs.existsSync(source);
        if (!sourceExists) {
            console.error(`Source file doesn't exist: ${source}`);
            return false;
        }

        // Создаем директорию назначения, если она не существует
        const targetDir = path.dirname(target);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Копируем файл
        fs.copyFileSync(source, target);
        console.log(`Copied: ${source} -> ${target}`);
        return true;
    } catch (error) {
        console.error(`Error copying file from ${source} to ${target}:`, error);
        return false;
    }
}

// Путь к директории сборки
const distDir = path.resolve(__dirname, '../dist');

// Путь к директории с PWA-файлами
const webDir = path.resolve(__dirname, '../web');

// Список файлов для копирования
const filesToCopy = [
    { source: path.join(webDir, 'manifest.json'), target: path.join(distDir, 'manifest.json') },
    { source: path.join(webDir, 'service-worker.js'), target: path.join(distDir, 'service-worker.js') },
    { source: path.join(webDir, 'robots.txt'), target: path.join(distDir, 'robots.txt') },
    { source: path.join(webDir, 'apple-touch-icon.png'), target: path.join(distDir, 'apple-touch-icon.png') }
];

// Копируем файлы
let allCopied = true;
for (const file of filesToCopy) {
    const success = copyFile(file.source, file.target);
    if (!success) {
        allCopied = false;
    }
}

// Обновляем index.html, добавляя ссылку на manifest и service-worker
const indexPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexPath)) {
    let indexHtml = fs.readFileSync(indexPath, 'utf8');
    
    // Проверяем, есть ли уже ссылка на манифест
    if (!indexHtml.includes('<link rel="manifest"')) {
        // Добавляем ссылку на манифест перед закрывающим тегом </head>
        indexHtml = indexHtml.replace('</head>', '  <link rel="manifest" href="/manifest.json" />\n  <meta name="theme-color" content="#000000" />\n  <meta name="apple-mobile-web-app-capable" content="yes" />\n  <meta name="apple-mobile-web-app-status-bar-style" content="default" />\n</head>');
    }
    
    // Проверяем, есть ли уже регистрация service-worker
    if (!indexHtml.includes('serviceWorker.register')) {
        // Добавляем скрипт для регистрации service-worker перед закрывающим тегом </body>
        indexHtml = indexHtml.replace('</body>', `  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
          .then(function(registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope);
          })
          .catch(function(error) {
            console.log('Service Worker registration failed: ', error);
          });
      });
    }
  </script>
</body>`);
    }
    
    // Записываем обновленный HTML
    fs.writeFileSync(indexPath, indexHtml);
    console.log('Updated index.html to include PWA features');
} else {
    console.error(`index.html not found at ${indexPath}`);
    allCopied = false;
}

if (allCopied) {
    console.log('All PWA files successfully copied and configured!');
} else {
    console.warn('Some files were not copied. Check errors above.');
}
