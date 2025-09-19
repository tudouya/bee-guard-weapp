# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

这是 **bee-guard** 蜜蜂疫病监控平台微信小程序项目。代码库包含：

- **当前项目**: 新蜜蜂疫病监控平台的空工作区
- **遗留代码**: `smart-hive-weapp/` 目录包含已归档的"新甜蜜"智能蜂箱管理系统，供组件复用

## 项目背景

新项目是一个蜜蜂疫病监控平台小程序，主要服务于：
- **蜂农用户**: 检测服务、结果查询、疫情数据查看、知识库学习、社区交流

## 架构与开发方式

### 技术栈
- 微信小程序原生开发
- UI组件: 以小程序原生组件为主，必要时复用已有 ECharts（ec-canvas）。
- 图表: ECharts 数据可视化
- 从 `smart-hive-weapp/` 复用遗留组件

### 小程序核心功能
- 检测号注册和微信支付集成
- 蜂场调查问卷和样本邮寄说明
- 检测结果查询和产品推荐展示
- 疫情数据可视化查询（省市县维度）
- 疫病知识库和防控方案
- 用户问答和经验分享社区

### 遗留项目可复用组件
`smart-hive-weapp/` 目录包含：
- EC-Canvas 图表组件 (`ec-canvas/`)
- 图表能力建议使用 ECharts（配合 ec-canvas）。
- 工具函数 (`utils/`)
- 地图集成组件
- 文件上传和媒体处理组件
- 基础页面模板和导航模式

### 开发命令
由于这是微信小程序项目，开发通常通过微信开发者工具完成。暂未配置构建脚本。

## 文件结构规划

基于 smart-hive-weapp 和热门开源项目的最佳实践，新项目将采用以下结构：

```
├── app.js                    # 小程序入口文件
├── app.json                  # 小程序全局配置
├── app.wxss                  # 全局样式文件
├── sitemap.json              # 微信搜索配置
├── project.config.json       # 项目配置
├── project.private.config.json  # 私有配置

├── pages/                    # 主包页面
│   ├── index/               # 首页
│   ├── auth/                # 认证相关
│   │   ├── login/           # 登录页面
│   │   └── register/        # 检测号注册
│   ├── detection/           # 检测相关
│   │   ├── survey/          # 蜂场调查问卷
│   │   ├── payment/         # 自费检测支付
│   │   └── guide/           # 样品邮寄说明
│   ├── results/             # 结果查询
│   │   ├── list/            # 检测记录列表
│   │   └── detail/          # 结果详情
│   ├── epidemic/            # 疫情数据
│   │   └── map/             # 疫情地图
│   └── profile/             # 个人中心
│       └── index/

├── packageKnowledge/         # 知识库分包
│   └── pages/
│       ├── disease-list/     # 疾病列表
│       ├── disease-detail/   # 疾病详情
│       └── prevention/       # 防控方案

├── packageCommunity/         # 社区分包
│   └── pages/
│       ├── qa-list/          # 问答列表
│       ├── qa-detail/        # 问答详情
│       ├── qa-post/          # 发布问题
│       ├── share-list/       # 经验分享列表
│       ├── share-detail/     # 分享详情
│       └── share-post/       # 发布经验

├── components/               # 公共组件
│   ├── chart/               # 图表组件（复用 ec-canvas）
│   ├── form/                # 表单组件
│   ├── upload/              # 文件上传组件
│   └── navbar/              # 导航组件

├── utils/                   # 工具函数（复用 smart-hive-weapp）
│   ├── util.js             # 通用工具函数
│   ├── request.js          # 网络请求封装
│   ├── auth.js             # 认证相关
│   └── constant.js         # 常量定义

├── services/                # API服务层
│   ├── auth.js             # 认证接口
│   ├── detection.js        # 检测接口
│   ├── epidemic.js         # 疫情数据接口
│   └── community.js        # 社区接口

├── config/                  # 配置文件（复用 smart-hive-weapp 模式）
│   ├── api.js              # API接口配置
│   ├── env.js              # 环境配置
│   └── constants.js        # 业务常量

└── assets/                  # 静态资源
    ├── images/             # 图片资源
    │   ├── icons/          # 图标
    │   ├── tabbar/         # 底部导航图标
    │   └── disease/        # 疾病相关图片
    └── styles/             # 样式文件
        └── common.wxss     # 公共样式
```

### 结构设计说明

1. **主包页面优化**: 按功能模块分组，避免 smart-hive-weapp 中页面平铺的问题
2. **分包策略**: 知识库和社区功能独立分包，优化加载性能
3. **组件复用**: 从 smart-hive-weapp 复用图表、工具等成熟组件
4. **服务层分离**: 新增 services 层统一管理API调用
5. **资源分类**: 图片资源按业务分类存放，便于维护

## 开发指南

### 遗留代码使用方式
- **复制粘贴方式**: 从 `smart-hive-weapp/` 目录中复制需要的组件和代码到新项目对应目录
- **不是路径引用**: 不直接引用旧项目路径，而是复制代码文件到新项目中
- **修改适配**: 复制后需要根据新项目需求进行修改和适配
- **保持一致性**: 保持与现有页面的样式与交互一致（按钮与表单统一使用全局工具类）。
- **重点复用**: 优先复用工具函数（日期格式化、API请求）和基础组件
- **改编适配**: 图表组件需要改编以满足疫情数据可视化需求

### 小程序端关键技术要求
- 微信支付集成（自费检测服务）
- 微信手机号一键登录认证
- 图片/视频上传功能（用户提问和经验分享）
- ECharts图表展示疫情数据
- 移动端优化的表单设计（调查问卷）
- 微信小程序分享功能
