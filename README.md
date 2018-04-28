# platform
多项目打包工具

### 使用说明

##### 目录结构说明：
```

├── config
│   ├── config.js  // 用来生成webpack配置文件需要的一些参数
│   │
│   ├── convert.js  // 根据项目描述文件生成config.json
│   │
│   ├── description.js  // 项目描述文件
│   │
│   ├── webpack.dev.js  // 开发模式打包
│   │
│   └── webpack.prod.js  // 生成模式打包
├── src
│   ├── components  // 所有项目公用模块
│   │
│   ├── common  // 所有项目公用静态资源
│   │
│   ├── static  // 打包工具需要使用的静态文件
│   │
│   ├── index.jsx  // 框架入口
│   │
│   ├── index.html // 框架模板
│   │
│   ├── index.scss // 框架样式
│   │
├── node_modules
├── .babelrc
├── postcss.config.js
└── package.json

```

##### 项目配置说明
description.js 是一个项目描述文件也是一个项目配置文件具体说明如下：
###### 配置文件：
```javascript
{
  version: 1,
  index: 'index.jsx',
  context: '../src',
  json: '../src/common/config.json',
  list: [{
    type: 'link',
    icon: '',
    title: '权限管理系统',
    link: 'https://sogo.com/',
    disabled: true,
    welcome: true
  }, {
    type: 'package',
    icon: '',
    title: '双11管理系统',
    path: './double-eleven'
  }, {
    type: 'package',
    icon: '',
    title: '安全推广',
    path: './security',
    disabled: true,
    children: [{
      type: 'page',
        icon: '',
        title: '中转链接管理',
        path: 'list.jsx',
        disabled: true
      },
      {
        type: 'package',
        icon: '',
        title: '中转链接管理',
        path: 'www',
        disabled: true
      }]
    }
  }]
}

```
###### 如上配置说明
- **version**: 版本号
- **index**: 子项目默认入口文件名
- **context**: 打包目录
- **json**: 根据该描述文件最终生成json文件的位置
- **list**:项目列表
- **type**: 项目类型 （目前支持三类 ：link、 package、 page）
- **icon**: 修饰链接用的小图标
- **title**: 项目名称
- **path**: 根据 path 找到 entry 生成入口页面 （type：package | page 时生效）
- **link**: 项目链接地址 （type：link 时生效）
- **disabled**: 该项目是否需要打包
- **welcome**: 欢迎页
- **children**: 默认页之外的其他页面（配置多页面时候启用）

###### 项目维护：
- **增加项目**
需手动配置描述description文件,在项目列表list中追加项目描述（项目描述是一个object的对象，参考配置文件）
- **删除项目**
需手动配置描述description文件,在项目列表list中直接删除对应的项目描述即可

###### 项目打包原理：
运行打包命令后，打包程序会根据描述文件description.js里指定的json目录（../src/common/config.json） 生成相应的项目列表，项目框架会根据这个json文件（config.json）生成项目的入口页,同时webpack会根据描述文件里对应的项目信息进行打包编译，生成json文件里对应的子项目

##### 打包命令：

###### 项目开发过程使用，启动服务，实时刷新
npm run dev

###### 开发完成之后打包文件
npm run pro
