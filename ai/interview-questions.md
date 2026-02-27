# AI前端工程师面试题汇总

## 一、基础知识类

### 1.1 LLM基础

**Q1: 什么是大语言模型（LLM）？它的工作原理是什么？**

参考答案：
- LLM是基于Transformer架构的深度学习模型
- 通过海量文本数据预训练，学习语言的统计规律
- 采用自回归方式逐token生成文本
- 核心是注意力机制，能够捕捉长距离依赖关系
- 代表模型：GPT系列、Claude、LLaMA等

**Q2: 解释一下Transformer中的Self-Attention机制？**

参考答案：
- Self-Attention允许模型在处理每个位置时关注输入序列的所有位置
- 计算公式：Attention(Q,K,V) = softmax(QK^T/√d)V
- Q(Query)、K(Key)、V(Value)通过线性变换得到
- 缩放因子√d防止点积过大导致梯度消失
- 多头注意力(Multi-Head)允许模型关注不同的表示子空间

**Q3: 为什么Transformer使用Layer Normalization而不是Batch Normalization？**

参考答案：
- NLP任务中序列长度不固定，BN难以处理
- LN在每个样本内部归一化，不依赖batch size
- LN更适合处理变长序列，保持样本内特征的相对关系
- BN在CV中有效是因为图像特征在不同样本间有可比性

### 1.2 Token与计费

**Q4: 什么是Token？如何估算Token数量？**

参考答案：
- Token是LLM处理文本的最小单位
- 英文约1个单词 = 1.3个token
- 中文约1个汉字 = 1.5-2个token
- 可使用tiktoken等库精确计算
- 不同模型使用不同的tokenizer(token 算法)

**Q5: 如何优化LLM API的调用成本？**

参考答案：
1. 优化Prompt，减少不必要的token
2. 使用更小的模型处理简单任务
3. 实现缓存机制，避免重复调用
4. 合理设置max_tokens限制输出长度
5. 使用流式输出，按需截断
6. 批量处理请求，减少API调用次数

## 二、LLM应用开发类

### 2.1 API调用

**Q6: 如何实现LLM API的错误处理和重试机制？**

参考答案：
```javascript
async function withRetry(fn, options = {}) {
  const { maxRetries = 3, delay = 1000, backoff = 2 } = options;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429) {
        const waitTime = error.headers?.['retry-after'] || delay * Math.pow(backoff, i);
        await sleep(waitTime);
      } else if (error.status >= 500 || error.code === 'ECONNABORTED') {
        await sleep(delay * Math.pow(backoff, i));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}
```

**Q7: 如何处理LLM的上下文窗口限制？**

参考答案：
1. 滑动窗口：保留最近的N轮对话
2. 摘要压缩：对历史对话生成摘要
3. 向量检索：只检索相关历史片段
4. 分层记忆：短期记忆+长期记忆
5. 使用长上下文模型（如Claude 200K）

### 2.2 流式输出

**Q8: SSE和WebSocket有什么区别？AI对话场景如何选择？**

参考答案：
| 特性 | SSE | WebSocket |
|------|-----|-----------|
| 通信方向 | 单向 | 双向 |
| 协议 | HTTP | WS/WSS |
| 重连 | 自动 | 手动 |
| 复杂度 | 简单 | 较复杂 |

AI对话场景推荐SSE：
- 只需要服务器推送，不需要双向通信
- 实现简单，浏览器原生支持
- 自动重连机制
- 基于HTTP，兼容性好

**Q9: 如何实现流式输出的取消功能？**

参考答案：
```javascript
const controller = new AbortController();

async function streamChat(message) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
    signal: controller.signal
  });
  
  // 处理流式响应...
}

// 取消请求
controller.abort();
```

## 三、RAG系统类

### 3.1 RAG架构

**Q10: 什么是RAG？它解决了什么问题？**

参考答案：
- RAG（Retrieval-Augmented Generation）检索增强生成
- 结合外部知识库增强LLM的生成能力
- 解决的问题：
  - 知识时效性：LLM训练后无法获取新知识
  - 领域专业性：企业私有知识LLM无法学习
  - 幻觉问题：减少模型编造事实
  - 可解释性：回答基于检索到的文档

**Q11: RAG和微调如何选择？**

参考答案：
| 场景 | 推荐方案 |
|------|----------|
| 知识频繁更新 | RAG |
| 需要引用来源 | RAG |
| 成本敏感 | RAG |
| 风格/格式调整 | 微调 |
| 领域深度理解 | 微调+RAG |

### 3.2 文档处理

**Q12: RAG中的文档分块策略有哪些？**

参考答案：
1. 固定大小分块：简单但可能切断语义
2. 递归字符分块：按分隔符层级分割
3. 语义分块：基于embedding相似度分割
4. 结构化分块：按文档结构（标题、段落）分割

推荐：递归字符分块，chunk_size=500-1000，overlap=10-20%

**Q13: 如何选择Embedding模型？**

参考答案：
- OpenAI text-embedding-3-small/large：效果好，有成本
- bge-large-zh：中文效果好，开源免费
- m3e-base：国产开源，性价比高
- 选择考虑：语言、维度、成本、效果

### 3.3 检索优化

**Q14: 如何提高RAG的检索准确率？**

参考答案：
1. 混合检索：向量检索+关键词检索
2. 重排序：使用Reranker精排
3. 查询扩展：扩展用户查询词
4. 多路召回：不同策略并行检索
5. 元数据过滤：按时间、来源等过滤

**Q15: 什么是混合检索？如何实现？**

参考答案：
混合检索结合向量检索和关键词检索：
```javascript
async function hybridSearch(query, topK) {
  const [vectorResults, keywordResults] = await Promise.all([
    vectorSearch(query, topK),
    keywordSearch(query, topK)
  ]);
  
  // RRF融合
  const scores = new Map();
  vectorResults.forEach((doc, i) => {
    scores.set(doc.id, (scores.get(doc.id) || 0) + 1 / (i + 60));
  });
  keywordResults.forEach((doc, i) => {
    scores.set(doc.id, (scores.get(doc.id) || 0) + 1 / (i + 60));
  });
  
  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK);
}
```

## 四、Agent开发类

### 4.1 Agent架构

**Q16: 什么是AI Agent？它和传统ChatBot有什么区别？**

参考答案：
| 特性 | ChatBot | Agent |
|------|---------|-------|
| 交互模式 | 单轮问答 | 多轮任务执行 |
| 能力边界 | 仅文本生成 | 可调用工具 |
| 决策能力 | 无 | 自主规划 |
| 状态管理 | 无状态 | 有状态记忆 |

Agent核心能力：自主决策、工具调用、记忆、多步推理

**Q17: 解释ReAct模式的工作原理？**

参考答案：
ReAct = Reasoning + Acting
```
用户输入 → 思考 → 行动 → 观察 → 循环...
```
流程：
1. Thought：分析当前状态，决定下一步
2. Action：调用工具或执行操作
3. Observation：获取执行结果
4. 重复直到任务完成

### 4.2 工具调用

**Q18: 如何设计Agent的工具集？**

参考答案：
工具设计原则：
1. 功能单一：每个工具只做一件事
2. 描述清晰：让LLM理解何时使用
3. 参数规范：JSON Schema定义参数
4. 错误处理：返回明确的错误信息
5. 幂等性：相同输入产生相同输出

```javascript
const tool = {
  name: 'search_web',
  description: '搜索互联网获取信息，适用于需要最新数据或事实查询',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: '搜索关键词' },
      limit: { type: 'number', description: '返回结果数量', default: 5 }
    },
    required: ['query']
  }
};
```

**Q19: LangChain和LangGraph有什么区别？**

参考答案：
- LangChain：链式调用，适合线性流程
- LangGraph：状态机编排，适合复杂分支流程
- LangGraph提供更好的可控性和可观测性
- LangGraph支持循环和条件分支
- 复杂Agent推荐LangGraph

## 五、Prompt工程类

### 5.1 Prompt设计

**Q20: 什么是Few-Shot Learning？如何应用？**

参考答案：
Few-Shot通过提供少量示例帮助模型理解任务：
```javascript
const prompt = `
请判断情感倾向：

示例1：
输入：今天天气真好
输出：积极

示例2：
输入：我很失望
输出：消极

现在请处理：
输入：{userInput}
输出：`;
```

适用场景：格式转换、分类、结构化输出

**Q21: 什么是Chain-of-Thought（思维链）？**

参考答案：
CoT让模型逐步思考，提高复杂推理任务的准确率：
```
请一步步思考：
1. 分析问题
2. 列出已知条件
3. 推导过程
4. 得出结论
```

适用场景：数学计算、逻辑推理、复杂问题分析

### 5.2 安全防护

**Q22: 什么是Prompt注入攻击？如何防护？**

参考答案：
Prompt注入：恶意输入试图改变模型行为

防护措施：
1. 输入验证：过滤危险关键词
2. 分离指令：区分系统提示和用户输入
3. 权限控制：限制模型能力范围
4. 输出过滤：检查敏感信息
5. 使用结构化输入格式

```javascript
const dangerousPatterns = [
  /ignore (previous|all) instructions/i,
  /disregard/i,
  /you are now/i
];

function sanitizeInput(input) {
  for (const pattern of dangerousPatterns) {
    if (pattern.test(input)) {
      return { safe: false };
    }
  }
  return { safe: true, input };
}
```

## 六、项目经验类

### 6.1 项目设计

**Q23: 如何设计一个AI客服系统？**

参考答案：
架构设计：
1. 知识库构建：RAG + 向量数据库
2. 对话管理：多轮对话上下文
3. 意图识别：分类用户问题类型
4. 槽位填充：提取关键信息
5. 人工转接：复杂问题转人工

技术选型：
- LLM：GPT-4o / DeepSeek
- 向量库：Milvus / ChromaDB
- 框架：LangChain / LangGraph
- 前端：React + SSE流式输出

**Q24: 如何评估RAG系统的效果？**

参考答案：
评估维度：
1. 检索质量：Precision、Recall、MRR、NDCG
   1. Precision（准确率）
   2. Recall（召回率）
   3. F1（F1分数）
   4. MRR（平均倒数排名）
   5. NDCG（归一化折扣累积增益）
2. 生成质量：BLEU、ROUGE、人工评估
3. 端到端：答案准确率、响应时间
4. 用户反馈：满意度、问题解决率

评估方法：
- 构建测试集，包含问题和标准答案
- 自动化评估指标
- 人工抽样评估
- A/B测试对比

### 6.2 问题解决

**Q25: 遇到LLM幻觉问题怎么解决？**

参考答案：
1. 使用RAG引入外部知识，确保答案基于可靠信息
2. 降低temperature参数，减少随机性
3. 系统提示约束输出范围
4. 要求模型引用来源
5. 多模型交叉验证，选择效果好的模型
6. 人工审核关键内容，过滤错误信息

**Q26: 如何优化LLM应用的响应速度？**

参考答案：
1. 使用流式输出，降低首字节时间（TTFB）
2. 选择更快的模型（如GPT-4o-mini）
3. 实现缓存机制
4. 异步处理非关键步骤
5. 使用CDN加速API请求
6. 预计算常见问题的答案

## 七、代码实现类

### 7.1 手写代码

**Q27: 实现一个简单的SSE客户端**

```javascript
class SSEClient {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.eventSource = null;
  }

  connect() {
    this.eventSource = new EventSource(this.url);

    this.eventSource.onopen = () => {
      this.options.onOpen?.();
    };

    this.eventSource.onmessage = (event) => {
      this.options.onMessage?.(event.data);
    };

    this.eventSource.onerror = (error) => {
      this.options.onError?.(error);
      this.eventSource.close();
    };
  }

  close() {
    this.eventSource?.close();
  }
}
```

**Q28: 实现一个简单的对话历史管理器**

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
    return this.messages.reduce((sum, m) => {
      const chineseChars = (m.content.match(/[\u4e00-\u9fa5]/g) || []).length;
      const englishWords = m.content.replace(/[\u4e00-\u9fa5]/g, ' ').split(/\s+/).filter(w => w).length;
      return sum + Math.ceil(chineseChars * 1.5 + englishWords * 1.3) + 4;
    }, 0);
  }

  getMessages() {
    return [...this.messages];
  }

  clear() {
    this.messages = [];
  }
}
```

## 八、综合场景题

**Q29: 用户反馈AI回答不准确，如何排查和优化？**

参考答案：
排查步骤：
1. 检查用户输入是否清晰
2. 查看检索结果是否相关
3. 分析Prompt是否有效引导
4. 检查模型参数设置
5. 查看是否有幻觉现象

优化方案：
1. 优化检索策略，提高召回率
2. 改进Prompt，增加约束条件
3. 调整模型参数
4. 增加Few-Shot示例
5. 引入人工反馈机制

**Q30: 如何从传统前端转型AI前端？**

参考答案：
学习路径：
1. 巩固前端基础（React/Vue + TypeScript）
2. 学习LLM基础概念和API调用
3. 掌握Prompt Engineering
4. 实现流式输出（SSE）
5. 学习RAG系统原理
6. 了解Agent开发框架
7. 做项目积累经验

推荐项目：
- AI对话应用
- 知识库问答系统
- AI工作流编排平台
