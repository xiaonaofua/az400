# AZ-400 练习题库 - 100道题目在线练习

**🌐 在线访问：https://xiaonaofua.github.io/az400**

这是一个专门为 AZ-400 (Azure DevOps Solutions) 考试准备的在线练习题库。

**🔥 特色功能：**
- ✅ **100道完整题目** - 涵盖AZ-400考试要点
- ✅ **在线直接访问** - 无需安装，打开网页即用
- ✅ **中英文双语** - 可随时切换显示语言
- ✅ **题目导航** - 支持上一题/下一题浏览
- ✅ **答案解析** - 每题都有详细解释
- ✅ **移动友好** - 手机、平板完美适配

## 🚀 立即开始练习

**方法1：在线访问（推荐）**
```
直接访问：https://xiaonaofua.github.io/az400
```

**方法2：本地运行**
```bash
git clone https://github.com/xiaonaofua/az400.git
cd az400/client
npm install
npm start
# 访问 http://localhost:3000
```

## 🎯 使用方法

### 📱 在线练习（推荐）
1. 访问 https://xiaonaofua.github.io/az400
2. 浏览100道题目网格
3. 点击任意题目进入详细页面
4. 选择答案后点击"显示答案"
5. 查看正确答案和详细解释
6. 使用"上一题/下一题"按钮导航

### 💡 功能说明
- **语言切换**：点击"显示原文/显示中文"切换语言
- **题目计数**：显示当前题目位置（如：第15/100题）
- **来源标识**：每题显示数据来源和原始语言
- **答案解析**：提供详细的答案解释

## 💻 本地开发

如果你想在本地运行或修改代码：

```bash
# 1. 克隆仓库
git clone https://github.com/xiaonaofua/az400.git
cd az400

# 2. 安装依赖并启动
cd client
npm install
npm start

# 3. 打开浏览器访问
# http://localhost:3000
```

## 📁 项目结构

```
az400/
├── client/                    # React 前端应用
│   ├── src/
│   │   ├── components/        # React 组件
│   │   │   ├── QuestionList.js       # 题目列表组件
│   │   │   ├── QuestionDetail.js     # 题目详情组件
│   │   │   └── CountdownTimer.js     # 倒计时组件
│   │   ├── data/
│   │   │   └── questions.json        # 100道题目数据
│   │   ├── App.js            # 主应用组件
│   │   └── index.js          # 入口文件
│   ├── public/               # 静态资源
│   └── build/                # 构建产物（部署到GitHub Pages）
├── .github/workflows/        # GitHub Actions
│   └── deploy.yml           # 自动部署配置
├── package.json
└── README.md
```

## 📊 题目数据

### 数据来源
题目来源于以下合法网站：
- **EDUSUM** - 专业IT认证题库
- **ExamTopics** - 知名考试练习平台
- **其他认证学习网站**

### 数据统计
- **总题目数**：100道完整题目
- **语言支持**：中英文双语显示
- **题目类型**：单选题、多选题
- **包含内容**：题目、选项、正确答案、详细解析

### 数据更新
- 题目数据存储在 `client/src/data/questions.json`
- 每道题都包含完整的中英文版本
- 保留原始来源链接供验证学习

## ⚖️ 法律声明

本工具仅用于学习目的，所有题目均来自公开的网络资源。每道题目都保留了原始来源链接以供查证。请尊重原始内容的版权，不要将收集的题目用于商业用途。

## 🚀 部署说明

本项目使用最简单的 GitHub Pages 部署方式：

1. **静态文件**直接存放在根目录（index.html + static/）
2. **推送到 master 分支**即可
3. **在 GitHub 仓库设置中启用 Pages**，选择 "Deploy from a branch" -> "master"
4. **网站自动生效**

### 项目结构
```
az400/
├── index.html              # 主页面
├── static/                 # 静态资源
│   ├── css/               # 样式文件
│   └── js/                # JavaScript 文件
├── asset-manifest.json    # 资源清单
└── README.md
```

## 🎓 备考建议

### 📅 学习计划
- **每日练习**：建议每天完成10-15道题目
- **重点复习**：标记错误题目，重点复习
- **知识扩展**：点击来源链接深入学习相关知识点
- **模拟测试**：完整做完100道题进行模拟测试

### 📚 学习资源
- **官方文档**：结合微软官方AZ-400文档学习
- **实践操作**：在Azure DevOps环境中实际操作
- **社区讨论**：参与相关技术社区讨论

### 🎯 考试重点
- Azure Repos 和版本控制
- Azure Pipelines CI/CD
- Azure Artifacts 包管理
- 测试策略和质量管理
- 监控和反馈机制
- 安全性和合规性

**祝您AZ-400考试顺利通过！🍀**

---

## 📞 联系方式

如有问题或建议，欢迎：
- 提交 [GitHub Issues](https://github.com/xiaonaofua/az400/issues)
- 发起 [Pull Request](https://github.com/xiaonaofua/az400/pulls)

**⭐ 如果这个项目对您有帮助，请给个星标支持！**