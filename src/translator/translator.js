const axios = require('axios');

class Translator {
    constructor() {
        // 使用免费的翻译API或者Google Translate API
        this.useGoogleTranslate = process.env.GOOGLE_TRANSLATE_API_KEY ? true : false;
        this.mymemoryApiUrl = 'https://api.mymemory.translated.net/get';
    }

    async translateWithMyMemory(text, targetLang = 'zh') {
        try {
            const response = await axios.get(this.mymemoryApiUrl, {
                params: {
                    q: text,
                    langpair: `en|${targetLang}`,
                    de: 'az400studytool@example.com' // MyMemory要求提供邮箱
                }
            });

            if (response.data && response.data.responseData) {
                return response.data.responseData.translatedText;
            }
            return text; // 翻译失败时返回原文
        } catch (error) {
            console.error('MyMemory翻译失败:', error.message);
            return text;
        }
    }

    async translateWithGoogle(text, targetLang = 'zh') {
        // 如果有Google API Key，使用Google Translate
        if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
            return this.translateWithMyMemory(text, targetLang);
        }

        try {
            const { Translate } = require('@google-cloud/translate').v2;
            const translate = new Translate({
                key: process.env.GOOGLE_TRANSLATE_API_KEY
            });

            const [translation] = await translate.translate(text, targetLang);
            return translation;
        } catch (error) {
            console.error('Google翻译失败，使用备用翻译:', error.message);
            return this.translateWithMyMemory(text, targetLang);
        }
    }

    async detectLanguage(text) {
        // 简单的语言检测
        const hasKanji = /[\u4e00-\u9faf]/.test(text);
        const hasHiragana = /[\u3040-\u309f]/.test(text);
        const hasKatakana = /[\u30a0-\u30ff]/.test(text);
        
        if (hasKanji && (hasHiragana || hasKatakana)) {
            return 'ja'; // 日文
        } else if (hasKanji) {
            return 'zh'; // 中文
        } else {
            return 'en'; // 英文或其他
        }
    }

    async translate(text, targetLang = 'zh') {
        if (!text || text.trim().length === 0) {
            return text;
        }

        // 检测原始语言
        const sourceLang = await this.detectLanguage(text);
        
        // 如果已经是目标语言，直接返回
        if (sourceLang === targetLang) {
            return text;
        }

        // 分批翻译长文本
        if (text.length > 1000) {
            const sentences = text.split(/[.!?。！？]/);
            const translatedSentences = [];
            
            for (const sentence of sentences) {
                if (sentence.trim()) {
                    const translated = await this.translateWithGoogle(sentence.trim(), targetLang);
                    translatedSentences.push(translated);
                    // 添加延迟避免API限制
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
            
            return translatedSentences.join('。');
        }

        return this.translateWithGoogle(text, targetLang);
    }
}

const translator = new Translator();

async function translateText(text, targetLang = 'zh') {
    return translator.translate(text, targetLang);
}

module.exports = {
    translateText,
    Translator
};