const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { translateText } = require('../translator/translator');

class AZ400QuestionScraper {
    constructor() {
        this.questions = [];
        this.sources = [
            {
                name: 'ExamTopics',
                url: 'https://www.examtopics.com/exams/microsoft/az-400/',
                enabled: true
            },
            {
                name: 'MeasureUp',
                url: 'https://www.measureup.com/microsoft-azure-devops-solutions.html',
                enabled: true
            },
            {
                name: 'WhizLabs',
                url: 'https://www.whizlabs.com/microsoft-azure-certification-az-400/',
                enabled: true
            }
        ];
    }

    async scrapeExamTopics(page) {
        console.log('正在抓取 ExamTopics...');
        try {
            await page.goto('https://www.examtopics.com/exams/microsoft/az-400/', { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });

            // 尝试多种可能的选择器
            const possibleSelectors = [
                '.question-discussion-header',
                '.question-container',
                '.exam-question',
                '[class*="question"]',
                '.card'
            ];

            let foundSelector = null;
            for (const selector of possibleSelectors) {
                try {
                    await page.waitForSelector(selector, { timeout: 5000 });
                    foundSelector = selector;
                    console.log(`找到元素: ${selector}`);
                    break;
                } catch (e) {
                    console.log(`未找到选择器: ${selector}`);
                }
            }

            if (!foundSelector) {
                // 如果没有找到任何题目元素，创建一些示例题目
                console.log('网站可能需要登录或结构已改变，使用备用题目...');
                return this.generateSampleQuestions();
            }

            const questions = await page.evaluate((selector) => {
                const questionElements = document.querySelectorAll(selector);
                const results = [];

                questionElements.forEach((element, index) => {
                    try {
                        // 尝试多种方式获取题目文本
                        const questionText = element.querySelector('.card-text')?.innerText || 
                                           element.querySelector('.question-text')?.innerText ||
                                           element.querySelector('p')?.innerText ||
                                           element.innerText.substring(0, 200) || '';
                        
                        const questionNumber = element.querySelector('.question-title')?.innerText || 
                                             element.querySelector('h3')?.innerText ||
                                             `Question ${index + 1}`;
                        
                        // 查找答案选项
                        const answerContainer = element.closest('.question-discussion')?.querySelector('.question-choices') ||
                                              element.querySelector('.choices') ||
                                              element.querySelector('.options');
                        
                        const choices = answerContainer ? Array.from(answerContainer.querySelectorAll('.form-check, .choice, .option')).map(choice => {
                            return {
                                text: choice.querySelector('.form-check-label')?.innerText || 
                                      choice.querySelector('label')?.innerText ||
                                      choice.innerText || '',
                                isCorrect: choice.querySelector('.form-check-input')?.checked || false
                            };
                        }) : [];

                        if (questionText.length > 20) { // 确保不是空题目
                            results.push({
                                id: `examtopics_${Date.now()}_${index}`,
                                title: questionNumber,
                                question: questionText,
                                choices: choices,
                                source: 'ExamTopics',
                                sourceUrl: window.location.href,
                                originalLanguage: 'en'
                            });
                        }
                    } catch (err) {
                        console.log(`跳过题目 ${index + 1}: ${err.message}`);
                    }
                });

                return results;
            }, foundSelector);

            return questions.length > 0 ? questions : this.generateSampleQuestions();
        } catch (error) {
            console.error('ExamTopics 抓取失败:', error.message);
            return this.generateSampleQuestions();
        }
    }

    generateSampleQuestions() {
        console.log('生成示例 AZ-400 题目...');
        return [
            {
                id: `sample_${Date.now()}_1`,
                title: "AZ-400 Question 1 - Azure Pipelines",
                question: "You need to configure a build pipeline that automatically triggers when code is pushed to the main branch. Which YAML trigger should you use?",
                choices: [
                    { text: "trigger: main", isCorrect: true },
                    { text: "trigger: push", isCorrect: false },
                    { text: "trigger: auto", isCorrect: false },
                    { text: "trigger: continuous", isCorrect: false }
                ],
                source: 'Sample Questions',
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema',
                originalLanguage: 'en'
            },
            {
                id: `sample_${Date.now()}_2`,
                title: "AZ-400 Question 2 - DevOps Strategy",
                question: "Your organization wants to implement continuous integration. What is the primary benefit of using feature branches?",
                choices: [
                    { text: "Faster deployments", isCorrect: false },
                    { text: "Isolation of development work", isCorrect: true },
                    { text: "Reduced costs", isCorrect: false },
                    { text: "Better security", isCorrect: false }
                ],
                source: 'Sample Questions',
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/devops/repos/git/git-branching-guidance',
                originalLanguage: 'en'
            },
            {
                id: `sample_${Date.now()}_3`,
                title: "AZ-400 Question 3 - Azure Artifacts",
                question: "You need to share packages across multiple projects in your organization. Which Azure DevOps service should you use?",
                choices: [
                    { text: "Azure Repos", isCorrect: false },
                    { text: "Azure Pipelines", isCorrect: false },
                    { text: "Azure Artifacts", isCorrect: true },
                    { text: "Azure Boards", isCorrect: false }
                ],
                source: 'Sample Questions',
                sourceUrl: 'https://docs.microsoft.com/en-us/azure/devops/artifacts/',
                originalLanguage: 'en'
            }
        ];
    }

    async scrapeWithPuppeteer() {
        console.log('启动浏览器...');
        const browser = await puppeteer.launch({ 
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        try {
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

            // 抓取不同来源的题目
            const examTopicsQuestions = await this.scrapeExamTopics(page);
            this.questions.push(...examTopicsQuestions);

            console.log(`总共抓取到 ${this.questions.length} 道题目`);
            
        } finally {
            await browser.close();
        }
    }

    async translateQuestions() {
        console.log('开始翻译题目...');
        for (let i = 0; i < this.questions.length; i++) {
            const question = this.questions[i];
            try {
                console.log(`翻译第 ${i + 1}/${this.questions.length} 道题目...`);
                
                question.questionChinese = await translateText(question.question, 'zh');
                question.titleChinese = await translateText(question.title, 'zh');
                
                if (question.choices && question.choices.length > 0) {
                    question.choicesChinese = await Promise.all(
                        question.choices.map(async (choice) => ({
                            ...choice,
                            textChinese: await translateText(choice.text, 'zh')
                        }))
                    );
                }

                // 添加延迟避免API限制
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`翻译第 ${i + 1} 道题目失败:`, error.message);
                question.questionChinese = question.question; // 翻译失败时保持原文
                question.titleChinese = question.title;
            }
        }
    }

    async saveQuestions() {
        const dataPath = path.join(__dirname, '../../data/questions.json');
        await fs.writeFile(dataPath, JSON.stringify(this.questions, null, 2), 'utf8');
        console.log(`题目已保存到: ${dataPath}`);
    }

    async run() {
        try {
            console.log('开始收集 AZ-400 练习题...');
            await this.scrapeWithPuppeteer();
            
            if (this.questions.length > 0) {
                await this.translateQuestions();
                await this.saveQuestions();
                console.log(`成功处理 ${this.questions.length} 道题目！`);
            } else {
                console.log('没有找到题目，请检查网站可访问性。');
            }
        } catch (error) {
            console.error('运行失败:', error);
        }
    }
}

// 如果直接运行此文件
if (require.main === module) {
    const scraper = new AZ400QuestionScraper();
    scraper.run();
}

module.exports = AZ400QuestionScraper;