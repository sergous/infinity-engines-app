const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = async function(env, argv) {
  // Получаем базовую конфигурацию Expo
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Находим и удаляем стандартный HtmlWebpackPlugin
  const htmlPluginIndex = config.plugins.findIndex(
    plugin => plugin.constructor.name === 'HtmlWebpackPlugin'
  );
  
  if (htmlPluginIndex !== -1) {
    config.plugins.splice(htmlPluginIndex, 1);
  }
  
  // Добавляем новый HtmlWebpackPlugin с нашим шаблоном
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'web/index.html'),
      filename: 'index.html',
      inject: 'body'
    })
  );
  
  // Добавляем плагин для копирования необходимых PWA файлов
  config.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        // Копируем PWA манифест
        {
          from: path.resolve(__dirname, 'web/manifest.json'),
          to: path.resolve(config.output.path, 'manifest.json')
        },
        // Копируем сервис-воркер
        {
          from: path.resolve(__dirname, 'web/service-worker.js'),
          to: path.resolve(config.output.path, 'service-worker.js')
        },
        // Копируем robots.txt
        {
          from: path.resolve(__dirname, 'web/robots.txt'),
          to: path.resolve(config.output.path, 'robots.txt')
        },
        // Копируем иконку для iOS
        {
          from: path.resolve(__dirname, 'web/apple-touch-icon.png'),
          to: path.resolve(config.output.path, 'apple-touch-icon.png')
        }
      ]
    })
  );

  return config;
};
