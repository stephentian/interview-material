# LLM 应用开发

## 一、大语言模型基础

### 1.1 什么是LLM？

大语言模型（Large Language Model，LLM）是基于Transformer架构的深度学习模型，通过海量文本数据训练，具备理解和生成人类语言的能力。

**核心特点：**
- 自回归生成：逐token预测下一个token
- 上下文理解：通过注意力机制理解长文本依赖
- 涌现能力：规模增大后出现的推理、编程等能力

**主流模型：**
| 模型 | 提供商 | 特点 |
|------|--------|------|
| GPT-4/GPT-4o | OpenAI | 综合能力最强，多模态支持 |
| Claude 3.5 | Anthropic | 长上下文，安全性好 |
| DeepSeek | 深度求索 | 国产领先，性价比高 |
| Qwen | 阿里云 | 中文能力强，开源版本 |
| GLM-4 | 智谱AI | 国产，企业级应用 |

### 1.2 Transformer架构核心

```
输入 → Embedding → Positional Encoding
         ↓
    Multi-Head Attention
         ↓
    Feed Forward Network
         ↓
    Layer Normalization
         ↓
       输出
```

**核心组件：**
1. **Self-Attention（自注意力）**
   - Query, Key, Value 三元组
   - 计算公式：Attention(Q,K,V) = softmax(QK^T/√d)V
   - 缩放因子√d防止梯度消失

2. **Layer Normalization**
   - 对每个样本的所有特征进行归一化
   - 适合NLP任务（vs Batch Normalization）

3. **Positional Encoding**
   - 为序列位置添加位置信息
   - 正弦/余弦函数编码

## 二、LLM API调用

### 2.1 OpenAI API

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: '你是一个专业的助手' },
    { role: 'user', content: '请解释什么是闭包' }
  ],
  temperature: 0.7,
  max_tokens: 1000
});

console.log(completion.choices[0].message.content);
```

### 2.2 流式调用（SSE）

```javascript
const stream = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: '写一首诗' }],
  stream: true
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  process.stdout.write(content);
}
```

### 2.3 国产模型调用

**DeepSeek示例：**
```javascript
const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: '你好' }],
    stream: false
  })
});
```

## 三、关键参数解析

### 3.1 生成参数

| 参数 | 说明 | 推荐值 |
|------|------|--------|
| temperature | 控制随机性，0-2 | 创意任务0.7-1.0，精确任务0-0.3 |
| max_tokens | 最大生成长度 | 根据需求设置 |
| top_p | 核采样参数 | 通常0.9-1.0 |
| frequency_penalty | 频率惩罚 | 0-2，减少重复 |
| presence_penalty | 存在惩罚 | 0-2，鼓励多样性 |
| stop | 停止词 | 自定义结束标记 |

### 3.2 Token计算

```javascript
function estimateTokens(text) {
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = text.replace(/[\u4e00-\u9fa5]/g, ' ').split(/\s+/).filter(w => w).length;
  return Math.ceil(chineseChars * 1.5 + englishWords * 1.3);
}
```

**Token计费：**
- GPT-4o: 输入$2.5/1M tokens, 输出$10/1M tokens
- DeepSeek: 输入¥1/1M tokens, 输出¥2/1M tokens

## 四、上下文管理

### 4.1 对话历史管理

```javascript
class ConversationManager {
  constructor(maxTokens = 4000) {
    this.messages = [];
    this.maxTokens = maxTokens;
  }

  addMessage(role, content) {
    this.messages.push({ role, content });
    this.trimHistory();
  }

  trimHistory() {
    while (this.estimateTokens() > this.maxTokens && this.messages.length > 2) {
      this.messages.splice(1, 2);
    }
  }

  estimateTokens() {
    return this.messages.reduce((sum, m) => 
      sum + estimateTokens(m.content) + 4, 0
    );
  }
}
```

### 4.2 滑动窗口策略

```javascript
function slidingWindow(messages, windowSize = 10) {
  if (messages.length <= windowSize) return messages;
  
  return [
    messages[0],
    ...messages.slice(-(windowSize - 1))
  ];
}
```

### 4.3 摘要压缩策略

```javascript
async function summarizeHistory(messages, llm) {
  const historyText = messages
    .map(m => `${m.role}: ${m.content}`)
    .join('\n');
  
  const summary = await llm.chat({
    messages: [{
      role: 'user',
      content: `请用简洁的语言总结以下对话历史：\n${historyText}`
    }]
  });
  
  return [
    messages[0],
    { role: 'assistant', content: `历史摘要：${summary}` }
  ];
}
```

## 五、错误处理与重试

### 5.1 重试机制

```javascript
async function withRetry(fn, options = {}) {
  const { maxRetries = 3, delay = 1000, backoff = 2 } = options;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const waitTime = delay * Math.pow(backoff, i);
      await new Promise(r => setTimeout(r, waitTime));
    }
  }
}
```

### 5.2 错误类型处理

```javascript
function handleLLMError(error) {
  if (error.status === 429) {
    return { type: 'rate_limit', retryAfter: error.headers?.['retry-after'] };
  }
  if (error.status === 401) {
    return { type: 'auth_error', message: 'API密钥无效' };
  }
  if (error.status === 400) {
    return { type: 'bad_request', message: error.message };
  }
  if (error.code === 'ECONNABORTED') {
    return { type: 'timeout', message: '请求超时' };
  }
  return { type: 'unknown', message: error.message };
}
```

## 六、前端集成最佳实践

### 6.1 API密钥安全

```javascript
// 不要在前端暴露API密钥
// 通过后端代理调用

// 前端
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message: '你好' })
});

// 后端代理
app.post('/api/chat', async (req, res) => {
  const result = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: req.body.messages
  });
  res.json(result);
});
```

### 6.2 请求取消

```javascript
const controller = new AbortController();

async function chatWithAbort(message) {
  const signal = controller.signal;
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
      signal
    });
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('请求已取消');
    }
    throw error;
  }
}

// 取消请求
controller.abort();
```

### 6.3 响应缓存

```javascript
const cache = new Map();

async function chatWithCache(message) {
  const cacheKey = JSON.stringify(message);
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [message]
  });
  
  cache.set(cacheKey, response);
  return response;
}
```

## 七、面试高频问题

### Q1: LLM的Token是如何计算的？

**答案要点：**
- Token是文本的最小处理单位
- 英文约1个单词=1.3个token
- 中文约1个汉字=1.5-2个token
- 不同模型使用不同的tokenizer

### Q2: Temperature参数如何影响输出？

**答案要点：**
- temperature越低，输出越确定、一致
- temperature越高，输出越随机、多样
- 代码生成建议0-0.3
- 创意写作建议0.7-1.0

### Q3: 如何处理LLM的幻觉问题？

**答案要点：**
1. 使用RAG引入外部知识
2. 设置较低的temperature
3. 使用系统提示约束输出
4. 要求模型引用来源
5. 人工审核关键内容

### Q4: 上下文窗口限制如何解决？

**答案要点：**
1. 滑动窗口：保留最近的N轮对话
2. 摘要压缩：对历史对话进行摘要
3. 向量检索：只检索相关历史片段
4. 使用长上下文模型（如Claude 200K）
