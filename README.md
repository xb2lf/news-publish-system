# 全球新闻发布管理系统

该项目是一套管理系统，通过不同的账号控制权限、路由以及新闻审核的各个环境

## 项目使用

在项目根目录中，你可以：

### 项目启动`npm start`

### 启动测试`npm test`

### 项目打包`npm run build`

### `npm run eject`

## 模拟后端及数据

项目src目录下存放着`db.json`，是本项目的模拟数据，使用`json-server`模拟后端

### 安装`json-server`

> npm i json-server

### 使用`json-server`

> json-server --watch .\db.json --port 5000
## 其他配置

其他一些基本配置
### 默认账号

- 用户名: admin
- 密码：123456

### 默认游客配置

- 路径：`/projectUrl/vistor`

- 用户名：1

- 密码：1
