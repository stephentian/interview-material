# RAG 系统（检索增强生成）

## 一、RAG 概述

### 1.1 什么是RAG？

RAG（Retrieval-Augmented Generation，检索增强生成）是一种结合外部知识库来增强LLM生成能力的技术架构。

> **💡 RAG**（Retrieval-Augmented Generation，检索增强生成）：先检索相关信息，再生成答案的技术。
> - **通俗解释**：让AI"开卷考试"，先从知识库里找相关资料，再基于资料回答问题，而不是凭记忆瞎编。
> - **例子**：问"公司年假有几天"，传统AI可能瞎编"5天"，RAG会先从公司员工手册中检索到"年假为10天"，然后准确回答"根据员工手册，年假为10天"。

**核心思想：**
```
用户问题 → 检索相关知识 → 结合知识生成回答
```

**解决的问题：**
- 知识时效性：LLM训练后无法获取新知识
  > **💡 知识时效性**：LLM的知识有截止日期，无法获取训练之后的新信息。
  > - **通俗解释**：AI的知识停留在训练数据的时间点，之后发生的事它不知道。
  > - **例子**：GPT-4的知识截止到2023年，你问它2024年奥运会谁夺冠，它答不上来。但用RAG连接实时新闻数据库，就能回答了。
- 领域专业性：企业私有知识LLM无法学习
  > **💡 领域专业性**：特定领域的专业知识，通用LLM可能不够了解。
  > - **通俗解释**：AI是通才，但不是每个领域的专家。公司内部文档、医疗诊断等专业内容，AI可能不懂。
  > - **例子**：问公司内部系统的操作流程，通用AI不知道，但RAG可以从公司文档库中检索到准确答案。
- 幻觉问题：减少模型编造事实
- 可解释性：回答基于检索到的文档
  > **💡 可解释性**：能够追溯答案的来源，知道AI为什么这么回答。
  > - **通俗解释**：AI回答时能告诉你"这个答案来自XX文档第X页"，而不是凭空而来。
  > - **例子**：AI回答"年假10天"后，还能告诉你"这个信息来自《员工手册》第5页"，方便核实。

### 1.2 RAG vs 微调

两者都是用于增强LLM能力的技术，但有不同的应用场景和实现方式。微调适用于调整模型在特定任务上的性能，而RAG则更关注于引入外部知识。

> **💡 微调**（Fine-tuning）：在预训练模型基础上，用特定领域数据继续训练，让模型适应特定任务。
> - **通俗解释**：就像一个大学毕业生，本来什么都懂一点，送去专门培训后，成为某个领域的专家。
> - **例子**：GPT本身是通用模型，用医疗数据微调后，可以变成"医疗AI"，更擅长回答医疗问题。

| 特性 | RAG | 微调 |
|------|-----|------|
| 知识更新 | 实时更新 | 需重新训练 |
| 成本 | 较低 | 较高 |
| 适用场景 | 知识密集型 | 风格/格式调整 |
| 可解释性 | 高 | 低 |
| 部署复杂度 | 中等 | 高 |

## 二、RAG 架构

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    RAG System                           │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │              离线索引构建                        │   │
│  │  文档 → 分块 → Embedding → 向量数据库             │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↓                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │              在线检索生成                        │   │
│  │  问题 → Embedding → 相似检索 → 重排序 → LLM生成   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 2.2 核心组件

1. **文档处理层**：文档解析、分块、清洗
2. **Embedding层**：文本向量化(使用预训练模型如BERT、GPT等)
   1. 自然语言处理（NLP）中把离散文本转化为连续数值向量的核心组件
   2. 把原本无语义的整数编码，转化为有语义的向量，让模型能理解文本的语义关联（比如 "苹果" 和 "水果" 的向量距离更近）
   
   > **💡 BERT**（Bidirectional Encoder Representations from Transformers）：一种预训练语言模型，擅长理解文本。
   > - **通俗解释**：Google开发的一个AI模型，特别擅长理解句子的意思，常用来做文本分类、问答等任务。
   > - **例子**：用BERT可以判断两个句子意思是否相近，比如"我很开心"和"我心情很好"会被识别为相似。
   
3. **向量数据库**：向量存储与检索

   > **💡 向量数据库**（Vector Database）：专门存储和检索向量的数据库。
   > - **通俗解释**：普通数据库存文字、数字，向量数据库存的是一串数字（向量），能快速找到"相似"的向量。
   > - **例子**：你存了"苹果"的向量[0.2,0.8,0.1]，想找相似的东西，向量数据库能快速找到"梨"[0.22,0.78,0.12]，因为它们的向量很接近。
   
4. **检索层**：相似度计算、混合检索
5. **重排序层**：结果精排
6. **生成层**：结合上下文生成回答

## 三、文档处理

### 3.1 文档解析

```javascript
class DocumentParser {
  async parse(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return await this.parsePDF(file);
      case 'docx':
        return await this.parseDocx(file);
      case 'md':
        return await this.parseMarkdown(file);
      case 'txt':
        return await this.parseText(file);
      default:
        throw new Error(`Unsupported format: ${extension}`);
    }
  }

  async parsePDF(file) {
    const pdfjs = await import('pdfjs-dist');
    const doc = await pdfjs.getDocument(file).promise;
    let text = '';
    
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(' ');
    }
    
    return text;
  }
}
```

### 3.2 文本分块策略

**固定大小分块：**

> **💡 分块**（Chunking）：把长文档切成小块，方便存储和检索。
> - **通俗解释**：就像把一本书拆成一个个段落，每段单独存储。这样检索时可以只找相关的段落，不用翻整本书。
> - **例子**：一篇10000字的文章，分成20个500字的小块，用户问问题时，只需要检索相关的那几个小块。
```javascript
/**
 * 固定大小分块
 * @param {string} text - 输入文本
 * @param {number} chunkSize - 每个块的最大字符数
 * @param {number} overlap - 块之间的重叠字符数
 * @returns {string[]} - 分块后的文本数组
 */
function fixedSizeChunk(text, chunkSize = 500, overlap = 50) {
  const chunks = [];
  
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  
  return chunks;
}
```

**递归字符分块（推荐）：**
```javascript
class RecursiveCharacterTextSplitter {
  constructor({
    chunkSize = 1000,
    chunkOverlap = 200,
    separators = ['\n\n', '\n', '。', '！', '？', ' ', '']
  }) {
    this.chunkSize = chunkSize;
    this.chunkOverlap = chunkOverlap;
    this.separators = separators;
  }

  splitText(text) {
    const finalChunks = [];
    
    const separator = this.separators.find(s => text.includes(s)) || '';
    const splits = text.split(separator);
    
    let currentChunk = [];
    let currentLength = 0;
    
    for (const split of splits) {
      if (currentLength + split.length > this.chunkSize) {
        if (currentChunk.length > 0) {
          finalChunks.push(currentChunk.join(separator));
          currentChunk = [split];
          currentLength = split.length;
        } else {
          const subChunks = this.splitText(split);
          finalChunks.push(...subChunks);
        }
      } else {
        currentChunk.push(split);
        currentLength += split.length + separator.length;
      }
    }
    
    if (currentChunk.length > 0) {
      finalChunks.push(currentChunk.join(separator));
    }
    
    return finalChunks;
  }
}
```

**语义分块：**
```javascript
async function semanticChunk(text, embeddingModel, threshold = 0.7) {
  const sentences = text.split(/[。！？\n]/);
  const chunks = [];
  let currentChunk = [sentences[0]];
  
  for (let i = 1; i < sentences.length; i++) {
    const prevEmbedding = await embeddingModel.embed(currentChunk.join(''));
    const currEmbedding = await embeddingModel.embed(sentences[i]);
    
    const similarity = cosineSimilarity(prevEmbedding, currEmbedding);
    
    if (similarity > threshold) {
      currentChunk.push(sentences[i]);
    } else {
      chunks.push(currentChunk.join(''));
      currentChunk = [sentences[i]];
    }
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(''));
  }
  
  return chunks;
}
```

### 3.3 分块参数选择

| 场景 | Chunk Size | Overlap | 说明 |
|------|------------|---------|------|
| 问答系统 | 500-1000 | 100-200 | 精准匹配 |
| 摘要生成 | 1000-2000 | 200-400 | 保留上下文 |
| 代码文档 | 200-500 | 50-100 | 保留完整函数 |

## 四、Embedding 模型

### 4.1 主流Embedding模型

| 模型 | 提供商 | 维度 | 特点 |
|------|--------|------|------|
| text-embedding-3-small | OpenAI | 1536 | 性价比高 |
| text-embedding-3-large | OpenAI | 3072 | 效果最好 |
| bge-large-zh | BAAI | 1024 | 中文效果好 |
| m3e-base | Moka | 768 | 国产开源 |

> **💡 向量维度**：向量的长度，即数字的个数。
> - **通俗解释**：每个词用多少个数字来表示。维度越高，能表达的信息越丰富，但计算量也越大。
> - **例子**：一个768维的向量就是768个数字组成的一串，比如[0.1, 0.5, -0.3, ..., 0.2]，共768个。

### 4.2 Embedding调用

```javascript
import { OpenAI } from 'openai';

const openai = new OpenAI();

async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  });
  
  return response.data[0].embedding;
}

async function batchEmbedding(texts, batchSize = 100) {
  const embeddings = [];
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: batch
    });
    embeddings.push(...response.data.map(d => d.embedding));
  }
  
  return embeddings;
}
```

### 4.3 相似度计算

```javascript
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (normA * normB);
}

function euclideanDistance(vecA, vecB) {
  return Math.sqrt(
    vecA.reduce((sum, a, i) => sum + Math.pow(a - vecB[i], 2), 0)
  );
}
```

> **💡 余弦相似度**（Cosine Similarity）：通过计算两个向量夹角的余弦值来判断相似程度。
> - **通俗解释**：比较两个向量的"方向"是否一致，而不是看距离远近。方向越一致，相似度越高。
> - **例子**：向量A=[1,1]和向量B=[2,2]方向完全一致，余弦相似度=1（最相似）；向量A=[1,0]和向量B=[0,1]方向垂直，余弦相似度=0（不相关）。

> **💡 欧氏距离**（Euclidean Distance）：两点之间的直线距离。
> - **通俗解释**：就是两点之间的"直线距离"，用尺子量的那个距离。
> - **例子**：在二维平面上，点(0,0)和点(3,4)的欧氏距离是√(3²+4²)=5。距离越小，两个向量越相似。

## 五、向量数据库

### 5.1 主流向量数据库

| 数据库 | 特点 | 适用场景 |
|--------|------|----------|
| Milvus | 高性能、分布式 | 大规模生产环境 |
| Pinecone | 全托管、易用 | 快速上线 |
| ChromaDB | 轻量、开源 | 开发测试 |
| PGVector | PostgreSQL扩展 | 已有PG生态 |
| Weaviate | 语义搜索强 | 复杂查询 |

### 5.2 ChromaDB使用

```javascript
import { ChromaClient } from 'chromadb';

const client = new ChromaClient();

const collection = await client.createCollection({
  name: 'documents',
  metadata: { description: '知识库文档' }
});

await collection.add({
  ids: ['doc1', 'doc2'],
  documents: ['文档内容1', '文档内容2'],
  metadatas: [{ source: 'file1.pdf' }, { source: 'file2.pdf' }]
});

const results = await collection.query({
  queryTexts: ['搜索问题'],
  nResults: 5
});
```

### 5.3 Milvus使用

```javascript
import { MilvusClient } from '@zilliz/milvus2-sdk-node';

const client = new MilvusClient({
  address: 'localhost:19530'
});

await client.createCollection({
  collection_name: 'documents',
  fields: [
    { name: 'id', data_type: 'VarChar', max_length: 256, is_primary_key: true },
    { name: 'embedding', data_type: 'FloatVector', dim: 1536 },
    { name: 'content', data_type: 'VarChar', max_length: 65535 }
  ]
});

await client.insert({
  collection_name: 'documents',
  data: [
    { id: '1', embedding: embeddingVector, content: '文档内容' }
  ]
});

const results = await client.search({
  collection_name: 'documents',
  vector: queryEmbedding,
  top_k: 5,
  params: { nprobe: 10 }
});
```

## 六、检索策略

### 6.1 纯向量检索

或叫语义检索，基础检索

```javascript
async function vectorSearch(query, topK = 5) {
  const queryEmbedding = await getEmbedding(query);
  
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK
  });
  
  return results;
}
```

### 6.2 混合检索（Hybrid Search）

语义 + 关键词

1. 先用 BM25/TF-IDF 做关键词检索
   1. 抓句子中的实体、专有名词、代码、术语
2. 再用 Embedding 语义检索
   1. 向量库语义找相近的词汇，句子
3. 结果加权融合

> **💡 BM25**：一种经典的关键词搜索算法，比简单的关键词匹配更智能。
> - **通俗解释**：搜索时不仅看关键词是否出现，还看出现次数、文档长度等，给每个文档打分。
> - **例子**：搜"苹果手机"，BM25会考虑"苹果"和"手机"两个词，出现次数多的文档排名更靠前，但也不会让很短的文档因为密度高而排第一。

> **💡 TF-IDF**（Term Frequency-Inverse Document Frequency）：一种衡量词语重要性的方法。
> - **通俗解释**：一个词在一篇文章中出现越多（TF高），同时在其他文章中出现越少（IDF高），这个词就越重要。
> - **例子**：在科技文章中，"技术"可能每篇都有，IDF低，不算重要；但"量子计算"只在少数文章出现，IDF高，是关键词。

示例：

搜索 “iPhone 续航差”

1. 先抓句子中的实体、专有名词、代码、术语
   1. 比如 “iPhone”、“续航”、“差”
   2. 只靠关键词：会错（比如 “苹果水果” 和 “苹果手机” 关键词重合但语义不同）；
2. 再用 Embedding 语义检索
   1. 向量库语义找相近的词汇，句子
   2. 比如 “iPhone 电池续航”、“电池续航时间”
   3. 只靠语义：会漏（比如 “电池续航” 和 “电池充电时间” 字面不同）、对专有名词 / 代码 / 术语不敏感；
3. 结果加权融合

```javascript
async function hybridSearch(query, topK = 10) {
  const [vectorResults, keywordResults] = await Promise.all([
    vectorSearch(query, topK),
    keywordSearch(query, topK)
  ]);
  
  const merged = mergeResults(vectorResults, keywordResults);
  return rerank(merged, topK);
}

function mergeResults(vectorResults, keywordResults, alpha = 0.7) {
  const scoreMap = new Map();
  
  vectorResults.forEach((doc, i) => {
    const score = alpha * (1 - i / vectorResults.length);
    scoreMap.set(doc.id, (scoreMap.get(doc.id) || 0) + score);
  });
  
  keywordResults.forEach((doc, i) => {
    const score = (1 - alpha) * (1 - i / keywordResults.length);
    scoreMap.set(doc.id, (scoreMap.get(doc.id) || 0) + score);
  });
  
  return Array.from(scoreMap.entries())
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score);
}
```

### 6.3 重排序（Rerank）

召回 Top20～Top50 → 丢给重排模型 → 取 Top3～Top5

重排模型专门做一件事：
判断：这段文本是否真的能回答这个问题？

> **💡 召回**（Recall）：从大量数据中初步筛选出可能相关的结果。
> - **通俗解释**：先粗略筛选，把可能相关的都捞出来，不追求精确。
> - **例子**：用户问"苹果手机价格"，召回阶段从100万条数据中找出100条可能相关的，不管准确度。

> **💡 重排序**（Rerank）：对召回的结果进行精细排序，把最相关的排在前面。
> - **通俗解释**：召回的结果可能有很多不相关的，重排序用更精确的方法重新打分，把真正有用的排到前面。
> - **例子**：召回的100条结果中，重排序模型仔细分析每条内容和问题的相关性，最终只保留最相关的5条给用户。

```javascript
async function rerank(query, documents, topK = 5) {
  const rerankerUrl = 'https://api.rerank.example.com/rerank';
  
  const response = await fetch(rerankerUrl, {
    method: 'POST',
    body: JSON.stringify({
      query,
      documents: documents.map(d => d.content),
      top_k: topK
    })
  });
  
  const { results } = await response.json();
  
  return results.map(r => ({
    ...documents[r.index],
    rerankScore: r.relevance_score
  }));
}
```

## 七、RAG Pipeline

### 7.1 完整Pipeline实现

```javascript
class RAGPipeline {
  constructor(config) {
    this.embedder = config.embedder;
    this.vectorStore = config.vectorStore;
    this.reranker = config.reranker;
    this.llm = config.llm;
  }

  async index(documents) {
    const chunks = [];
    
    for (const doc of documents) {
      const docChunks = this.splitDocument(doc.content);
      chunks.push(...docChunks.map((chunk, i) => ({
        id: `${doc.id}_${i}`,
        content: chunk,
        metadata: { source: doc.source, ...doc.metadata }
      })));
    }
    
    const embeddings = await this.embedder.batchEmbed(
      chunks.map(c => c.content)
    );
    
    await this.vectorStore.add(
      chunks.map(c => c.id),
      embeddings,
      chunks.map(c => c.content),
      chunks.map(c => c.metadata)
    );
  }

  async query(question, options = {}) {
    const { topK = 10, rerank = true, finalTopK = 3 } = options;
    
    const queryEmbedding = await this.embedder.embed(question);
    
    let results = await this.vectorStore.search(queryEmbedding, topK);
    
    if (rerank && this.reranker) {
      results = await this.reranker.rerank(question, results, finalTopK);
    }
    
    const context = results.map(r => r.content).join('\n\n');
    
    const answer = await this.llm.generate({
      messages: [
        { role: 'system', content: this.buildSystemPrompt() },
        { role: 'user', content: this.buildUserPrompt(question, context) }
      ]
    });
    
    return {
      answer: answer.content,
      sources: results.map(r => r.metadata),
      confidence: this.calculateConfidence(results)
    };
  }

  buildSystemPrompt() {
    return `你是一个专业的助手。请基于提供的上下文回答问题。
如果上下文中没有相关信息，请明确说明"根据提供的资料，我无法回答这个问题"。
回答时请引用来源。`;
  }

  buildUserPrompt(question, context) {
    return `上下文：
${context}

问题：${question}

请基于上下文回答问题，并标注信息来源。`;
  }
}
```

## 八、RAG 优化策略

### 8.1 检索优化

| 问题 | 解决方案 |
|------|----------|
| 检索不精准 | 混合检索 + 重排序 |
| 召回率低 | 增加topK、多路召回 |
| 上下文断裂 | 优化分块策略、增加overlap |
| 领域词汇 | 自定义分词、领域Embedding |

### 8.2 生成优化

```javascript
const optimizedPrompt = `你是一个专业的问答助手。

## 回答规则
1. 仅基于提供的上下文回答问题
2. 如果上下文不足，明确说明
3. 引用具体的来源段落
4. 回答简洁、准确

## 上下文
{context}

## 问题
{question}

## 回答格式
答案：[你的回答]
来源：[引用的段落]
置信度：[高/中/低]`;
```

### 8.3 评估指标

```javascript
/**
 * 评估RAG系统效果
 * @param {Array} results - 模型生成的结果，每个元素包含id、content、metadata
 * @param {Object} groundTruth - 包含relevantDocs（相关文档ID列表）和answer（标准答案）
 * @returns {Object} 包含Precision、Recall、F1、MRR、NDCG等指标
 * 
 * Precision（准确率）
 * 定义：检索到的相关文档中，实际相关的比例
 * 公式：TruePositives / RetrievedDocuments
 * 
 * Recall（召回率）
 * 定义：所有相关文档中，被成功检索到的比例
 * 公式：TruePositives / RelevantDocuments
 * 
 * F1（F1分数）
 * 定义：Precision和Recall的调和平均值
 * 公式：2 * (Precision * Recall) / (Precision + Recall)
 * 
 * MRR（平均倒数排名）
 * 定义：衡量第一个相关结果的排名倒数的平均值，关注“最佳结果”是否靠前
 * 公式：1 / (FirstRelevantRank + 1)
 * 
 * NDCG（归一化折扣累积增益）
 * 定义：考虑文档排名的相关性得分，归一化到[0,1]
 * 公式：DCG / IDCG
 */
function evaluateRAG(results, groundTruth) {
  const metrics = {
    precision: 0,
    recall: 0,
    f1: 0,
    mrr: 0,
    ndcg: 0
  };
  
  const retrievedIds = results.map(r => r.id);
  const relevantIds = groundTruth.relevantDocs;
  
  const truePositives = retrievedIds.filter(id => relevantIds.includes(id)).length;
  
  metrics.precision = truePositives / retrievedIds.length;
  metrics.recall = truePositives / relevantIds.length;
  metrics.f1 = 2 * (metrics.precision * metrics.recall) / (metrics.precision + metrics.recall);
  
  return metrics;
}
```

## 九、面试高频问题

### Q1: RAG和微调如何选择？

**答案要点：**
- RAG适合：知识频繁更新、需要引用来源、成本敏感
- 微调适合：风格调整、格式固定、领域深度理解
- 可以结合：先用RAG保证知识准确性，再微调优化风格

### Q2: 如何处理RAG检索结果不相关的问题？

**答案要点：**
1. 优化查询：查询扩展、查询改写
2. 混合检索：向量+关键词结合
3. 重排序：使用Reranker精排
4. 多路召回：不同策略并行检索
5. 反馈学习：根据用户反馈优化

### Q3: 分块大小如何选择？

**答案要点：**
- 太小：上下文不完整
- 太大：噪音增加、检索精度下降
- 建议：500-1000字符，overlap 10-20%
- 根据场景调整：问答用小块，摘要用大块

### Q4: 如何评估RAG系统效果？

**答案要点：**
1. 检索指标：Precision、Recall、MRR、NDCG
   1. Precision（准确率）
   2. Recall（召回率）
   3. F1（F1分数）
   4. MRR（平均倒数排名）
   5. NDCG（归一化折扣累积增益）
2. 生成指标：自动化评估、BLEU、ROUGE、人工评估
   1. BLEU（双语评估替补）
   2. ROUGE（召回-oriented评估）
   3. 人工评估（主观判断）
3. 端到端指标：答案准确率、用户满意度
4. A/B测试：对比不同配置效果

### Q5: 向量数据库如何选型？

**答案要点：**
- 数据规模：百万级以下ChromaDB，以上Milvus
- 运维能力：无运维选Pinecone，有运维选Milvus
- 已有技术栈：有PG选PGVector
- 功能需求：复杂查询选Weaviate
