
# cli

> scaffold 脚手架 `fe-cli`

## start

初始化Node.js项目： 使用npm init或yarn init创建一个新的Node.js项目，填写必要的信息。

```shell
mkdir fe-cli
cd fe-cli

npm init -y

```

安装依赖： 安装commander用于处理命令行参数，inquirer用于交互式提问，以及可能需要的模板生成器如 handlebars。

```bash
npm install commander inquirer handlebars --save
```

## commander

使用commander库定义命令结构，包括init, help, 和-v或--version。

```javascript
// index.js
const { program } = require('commander');
const inquirer = require('inquirer');
const generateProject = require('./generateProject');

program
  .version('0.1.0', '-v, --version')
  .description('Frontend CLI for initializing various project templates.')
  
program
  .command('init [template]')
  .description('Initialize a new project with the specified template.')
  .action((template) => {
    if (!template) {
      // 如果没有指定模板，启动交互式提问
      inquirer.prompt([
        // 提问选项
      ]).then(answers => {
        generateProject(answers.template);
      });
    } else {
      generateProject(template);
    }
  });

program.on('--help', () => {
  console.log('\nExamples:');
  console.log('  $ fe-cli init');
  console.log('  $ fe-cli init vue');
});

program.parse(process.argv);
```

## inquirer

使用inquirer库编写交互式提问逻辑，让用户选择要生成的项目模板。

```javascript
// 示例提问配置
const questions = [
  {
    type: 'list',
    name: 'template',
    message: '请选择要初始化的项目模板:',
    choices: ['vue', 'react', 'vue-ts', 'react-ts', 'uniapp'],
  },
];

// 根据用户选择生成项目
function generateProject(template) {
  console.log(`Generating project from template: ${template}...`);
  // 实际逻辑应包含根据模板下载或复制相应文件结构到新目录
}

// 在没有指定模板时调用此提问逻辑
```
