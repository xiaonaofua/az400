const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// API路由
app.get('/api/questions', async (req, res) => {
    try {
        const dataPath = path.join(__dirname, '../data/questions.json');
        const data = await fs.readFile(dataPath, 'utf8');
        const questions = JSON.parse(data);
        
        // 分页支持
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        
        const paginatedQuestions = questions.slice(startIndex, endIndex);
        
        res.json({
            questions: paginatedQuestions,
            totalQuestions: questions.length,
            currentPage: page,
            totalPages: Math.ceil(questions.length / limit),
            hasNextPage: endIndex < questions.length,
            hasPrevPage: page > 1
        });
    } catch (error) {
        console.error('读取题目失败:', error);
        res.status(500).json({ error: '无法读取题目数据' });
    }
});

app.get('/api/questions/:id', async (req, res) => {
    try {
        const dataPath = path.join(__dirname, '../data/questions.json');
        const data = await fs.readFile(dataPath, 'utf8');
        const questions = JSON.parse(data);
        
        const question = questions.find(q => q.id === req.params.id);
        if (!question) {
            return res.status(404).json({ error: '题目未找到' });
        }
        
        res.json(question);
    } catch (error) {
        console.error('读取题目失败:', error);
        res.status(500).json({ error: '无法读取题目数据' });
    }
});

app.get('/api/stats', async (req, res) => {
    try {
        const dataPath = path.join(__dirname, '../data/questions.json');
        const data = await fs.readFile(dataPath, 'utf8');
        const questions = JSON.parse(data);
        
        const stats = {
            totalQuestions: questions.length,
            sources: {},
            languages: {}
        };
        
        questions.forEach(question => {
            // 统计来源
            stats.sources[question.source] = (stats.sources[question.source] || 0) + 1;
            
            // 统计语言
            stats.languages[question.originalLanguage] = (stats.languages[question.originalLanguage] || 0) + 1;
        });
        
        res.json(stats);
    } catch (error) {
        console.error('读取统计信息失败:', error);
        res.status(500).json({ error: '无法读取统计信息' });
    }
});


// 服务React应用
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// 本地开发时启动服务器
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`服务器运行在端口 ${PORT}`);
        console.log(`访问 http://localhost:${PORT} 查看应用`);
    });
}

// Vercel 部署时导出 app
module.exports = app;