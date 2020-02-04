import fs from 'fs';
import path from 'path';
import readline from 'readline';

export default class BadWords {
    private static _instance: BadWords;
    private data: Array<string> = [];

    constructor () {
      const files = fs.readdirSync(path.resolve(__dirname, './libs/'));
      files.forEach(file => {
        if (path.extname(file) === '.txt') {
          const rl = readline.createInterface({
            input: fs.createReadStream(path.resolve(__dirname, './libs/', file))
          });
          rl.on('line', line => {
            if (line) {
              if (line.substring(line.length - 1) === ',') {
                line = line.substring(0, line.length - 1);
              }
              this.data.push(line);
            }
          });
        }
      });
    }

    public static get instance () {
      if (!BadWords._instance) {
        BadWords._instance = new BadWords();
      }
      return BadWords._instance;
    }

    filter (content: string) {
      const tempImgs: Array<string> = [];
      let result = content;

      // 将图片部分放入临时数组中，以避免待会儿过滤词会匹配到图片内容
      result = result.replace(/!\[.+\]\(.+\)/g, val => {
        tempImgs.push(val);
        return '#IMG#';
      });

      // 匹配过滤词并替换
      this.data.forEach(keyword => {
        if (result.toUpperCase().includes(keyword.toUpperCase())) {
          const asterisks: Array<'*'> = [];
          for (let i = 0; i < keyword.length; i++) {
            asterisks.push('*');
          }
          result = result.replace(new RegExp(keyword, 'gi'), asterisks.join(''));
        }
      });

      // 恢复图片
      if (tempImgs.length) {
        result = result.replace(/#IMG#/g, () => <string>tempImgs.shift());
      }
      return result;
    }
}
