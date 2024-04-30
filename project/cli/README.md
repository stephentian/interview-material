
# cli

> scaffold 脚手架 `fe-cli`

## 新建项目

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

## 命令设计

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
        {
          type: 'input',
          name: 'projectName',
          message: '请输入项目名称:',
          validate: (input) => {
            if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true;
            return '项目名称只能包含字母、数字、下划线和破折号';
          },
        },
        {
          type: 'confirm',
          name: 'useTs',
          message: '是否需要添加 TypeScript？',
          default: false,
        },
        {
          type: 'confirm',
          name: 'useSass',
          message: '是否使用 Sass？',
          default: false,
        },
      ]).then(answers => {
        generateProject(template, answers);
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

## 提问交互

使用inquirer库编写交互式提问逻辑，让用户选择要生成的项目模板。

```javascript
const fs = require('fs-extra');
const path = require('path');

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
async function generateProject(template, options = {}) {
  const projectName = options.projectName;
  const projectPath = path.join(process.cwd(), projectName);

  // 检查项目目录是否存在
  if (fs.existsSync(projectPath)) {
    console.error('项目已存在，请选择其他名称。');
    return;
  }

  // 基础Vue模板克隆地址
  let templateUrl = 'https://github.com/vuejs/vue-cli-template-simple.git'; // 示例地址，实际应替换为合适的Vue模板仓库

  // 根据选项调整模板URL或后续处理逻辑
  if (options.useTs) templateUrl += '-ts'; // 假设存在一个支持TS的分支或标签
  if (options.useSass) {
    // 在项目生成后手动添加Sass配置，或寻找支持Sass的模板
    console.log('项目创建后，将手动添加Sass配置。');
  }

  try {
    // 克隆模板到指定目录
    await execAsync(`git clone ${templateUrl} ${projectName}`);

    // 进入项目目录，安装依赖
    process.chdir(projectName);
    await execAsync('npm install');

    console.log(`项目 "${projectName}" 初始化完成。`);
  } catch (error) {
    console.error('项目初始化失败:', error.message);
  }
}

// 在没有指定模板时调用此提问逻辑
```

## 项目模版

使用`handlebars`库生成模板文件，包括 package.json、.gitignore、README.md 等。

- 简单实现：可以预先准备各模板的基本文件结构在本地或远程仓库，然后根据用户选择复制或下载这些文件。
- 高级实现：利用 Git 克隆模板仓库，或直接从 GitHub 等托管服务下载 zip 包并解压。

## 修改 package.json

```json
{  
  "name": "fe-cli",  
  "version": "1.0.0",  
  "description": "前端脚手架工具",  
  "bin": {  
    "fe-cli": "./bin/fe-cli"  
  },  
  "scripts": {  
    "test": "echo \"Error: no test specified\" && exit 1"  
  },  
  "dependencies": {  
    "commander": "^x.x.x",  
    "inquirer": "^x.x.x"  
  }  
}
```

## 测试和发布

本地测试：通过 node index.js 运行脚手架，在命令行中尝试各种命令确保一切正常。
打包发布：使用 npm pack 将项目打包成.tgz文 件，然后发布到npm仓库，或直接在项目根目录下运行npm publish。