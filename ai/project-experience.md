# AI前端项目经验模板

## 目录

- [项目一：AI聊天平台](#项目一ai聊天平台)
- [项目二：AI Agent工作流平台](#项目二ai-agent工作流平台)
- [项目三：AI面试官](#项目三ai面试官)
- [项目四：多模态AI助手](#项目四多模态ai助手)
- [项目五：企业知识库RAG系统](#项目五企业知识库rag系统)
- [项目经验总结模板](#项目经验总结模板)

---

## 项目一：AI聊天平台

### 项目概述

**项目名称：** 智能对话助手平台

**项目描述：** 类似ChatGPT的AI对话平台，支持多模型切换、流式输出、对话历史管理、知识库问答等功能。

**技术栈：**
- 前端：React 18 + TypeScript + Tailwind CSS
- 状态管理：Zustand
- 后端：Node.js + Express
- AI集成：OpenAI API / DeepSeek API
- 数据库：PostgreSQL + Redis

### 核心功能

```
┌─────────────────────────────────────────────────────────┐
│                    AI聊天平台架构                        │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  对话界面   │  │  模型选择   │  │  历史管理   │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                         ↓                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │              SSE流式通信层                       │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↓                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  LLM API    │  │  上下文管理  │  │  知识库RAG  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 技术亮点

#### 1. 流式输出实现

```typescript
// useStreamChat.ts
import { useState, useCallback, useRef } from 'react';

interface StreamChatOptions {
  onToken?: (token: string) => void;
  onComplete?: (fullResponse: string) => void;
  onError?: (error: Error) => void;
}

export function useStreamChat() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (
    message: string,
    options: StreamChatOptions = {}
  ) => {
    setContent('');
    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal: abortControllerRef.current.signal
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const json = JSON.parse(data);
              const token = json.choices?.[0]?.delta?.content || '';
              fullResponse += token;
              setContent(prev => prev + token);
              options.onToken?.(token);
            } catch (e) {}
          }
        }
      }

      options.onComplete?.(fullResponse);
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        options.onError?.(error as Error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  }, []);

  return { content, isLoading, sendMessage, stopGeneration };
}
```

#### 2. 对话历史管理

```typescript
// ConversationManager.ts
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  tokens?: number;
}

class ConversationManager {
  private messages: Message[] = [];
  private maxTokens: number;

  constructor(maxTokens: number = 4000) {
    this.maxTokens = maxTokens;
  }

  addMessage(role: Message['role'], content: string): Message {
    const message: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: Date.now(),
      tokens: this.estimateTokens(content)
    };
    
    this.messages.push(message);
    this.trimHistory();
    return message;
  }

  private estimateTokens(text: string): number {
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = text.replace(/[\u4e00-\u9fa5]/g, ' ').split(/\s+/).filter(w => w).length;
    return Math.ceil(chineseChars * 1.5 + englishWords * 1.3);
  }

  private trimHistory(): void {
    while (this.getTotalTokens() > this.maxTokens && this.messages.length > 2) {
      this.messages.splice(1, 2);
    }
  }

  private getTotalTokens(): number {
    return this.messages.reduce((sum, m) => sum + (m.tokens || 0) + 4, 0);
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  getMessagesForAPI(): Array<{ role: string; content: string }> {
    return this.messages.map(m => ({ role: m.role, content: m.content }));
  }
}
```

#### 3. 多模型切换

```typescript
// modelConfig.ts
interface ModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'deepseek' | 'anthropic';
  maxTokens: number;
  contextWindow: number;
  pricing: { input: number; output: number };
}

const MODEL_CONFIGS: Record<string, ModelConfig> = {
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    maxTokens: 4096,
    contextWindow: 128000,
    pricing: { input: 2.5, output: 10 }
  },
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    maxTokens: 4096,
    contextWindow: 128000,
    pricing: { input: 0.15, output: 0.6 }
  },
  'deepseek-chat': {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'deepseek',
    maxTokens: 4096,
    contextWindow: 64000,
    pricing: { input: 0.1, output: 0.2 }
  }
};

// useModelSwitch.ts
export function useModelSwitch() {
  const [currentModel, setCurrentModel] = useState<ModelConfig>(MODEL_CONFIGS['gpt-4o-mini']);

  const switchModel = useCallback((modelId: string) => {
    if (MODEL_CONFIGS[modelId]) {
      setCurrentModel(MODEL_CONFIGS[modelId]);
    }
  }, []);

  return { currentModel, switchModel, availableModels: Object.values(MODEL_CONFIGS) };
}
```

### 技术难点与解决方案

| 难点 | 解决方案 |
|------|----------|
| 流式输出中断处理 | 实现AbortController取消机制，支持用户随时停止生成；添加自动重连和断点续传 |
| 上下文窗口限制 | 实现Token估算和滑动窗口策略，自动裁剪历史对话；支持摘要压缩 |
| 多模型响应格式不一致 | 封装统一的响应适配层，标准化不同模型的输出格式 |
| API调用成本控制 | 实现请求缓存、智能压缩Prompt、选择合适模型降低成本 |

### 项目成果

- 支持3种主流大模型切换（GPT-4o、GPT-4o-mini、DeepSeek）
- 流式输出首字节延迟<100ms，用户体验流畅
- 支持对话历史导出/导入，数据不丢失
- 日活用户5000+，API调用成功率99.5%
- 个人贡献：独立负责前端架构设计和核心功能开发

### 面试回答示例

这是一个**AI对话平台**项目，主要解决用户与多模型LLM交互的需求。

技术选型上，我们选择了**React 18 + TypeScript + Zustand**，原因是：TypeScript保证类型安全，Zustand轻量且适合管理对话状态，React 18的并发特性优化了流式渲染性能。

我主要负责**流式输出模块和对话历史管理**，其中最关键的挑战是**流式输出的中断与恢复**。

我的解决方案是**封装useStreamChat Hook**，具体实现包括：
1. 使用AbortController实现请求取消，支持用户随时停止生成
2. 实现Token估算和滑动窗口策略，自动管理上下文窗口
3. 封装多模型适配层，统一不同模型的响应格式

最终项目取得了**日活5000+、API成功率99.5%**的成绩，我的主要贡献是**独立完成前端架构设计和核心功能开发**。

---

## 项目二：AI Agent工作流平台

### 项目概述

**项目名称：** 智能Agent编排平台

**项目描述：** 类似Coze/Dify的低代码AI Agent开发平台，支持可视化工作流编排、工具调用、多Agent协作。

**技术栈：**
- 前端：Vue 3 + TypeScript + Pinia
- 流程图：Vue Flow
- 状态机：XState
- 后端：Python + FastAPI
- Agent框架：LangGraph

### 核心功能

```
┌─────────────────────────────────────────────────────────┐
│                  Agent工作流平台架构                      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │              可视化编辑器                        │   │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │   │
│  │  │ LLM  │→ │ Tool │→ │条件  │→ │输出  │       │   │
│  │  └──────┘  └──────┘  └──────┘  └──────┘       │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↓                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │              工作流引擎                          │   │
│  │  解析 → 验证 → 执行 → 监控 → 日志              │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↓                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  LLM服务    │  │  工具库     │  │  知识库     │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 技术亮点

#### 1. 工作流可视化编辑

```html
<!-- WorkflowEditor.vue -->
<template>
  <div class="workflow-editor">
    <div class="toolbar">
      <button @click="addNode('llm')">添加LLM节点</button>
      <button @click="addNode('tool')">添加工具节点</button>
      <button @click="addNode('condition')">添加条件节点</button>
      <button @click="executeWorkflow">执行工作流</button>
    </div>
    
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      @connect="onConnect"
    />
    
    <div class="execution-panel">
      <div v-for="log in executionLogs" :key="log.id" class="log-item">
        [{{ log.timestamp }}] {{ log.nodeId }}: {{ log.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue';
import { VueFlow } from '@vue-flow/core';
import '@vue-flow/core/dist/style.css';
import LLMNode from './nodes/LLMNode.vue';
import ToolNode from './nodes/ToolNode.vue';
import ConditionNode from './nodes/ConditionNode.vue';

const nodeTypes = {
  llm: markRaw(LLMNode),
  tool: markRaw(ToolNode),
  condition: markRaw(ConditionNode)
};

const nodes = ref([]);
const edges = ref([]);
const executionLogs = ref([]);

const addNode = (type: string) => {
  const id = `${type}_${Date.now()}`;
  nodes.value.push({
    id,
    type,
    position: { x: Math.random() * 400, y: Math.random() * 400 },
    data: { label: `${type}节点` }
  });
};

const executeWorkflow = async () => {
  const workflow = compileWorkflow(nodes.value, edges.value);
  const result = await fetch('/api/workflow/execute', {
    method: 'POST',
    body: JSON.stringify({ workflow, input: {} })
  });
  // 处理执行结果...
};
</script>
```

#### 2. 工作流编译与执行

```typescript
// workflowCompiler.ts
interface WorkflowNode {
  id: string;
  type: 'llm' | 'tool' | 'condition' | 'output';
  config: Record<string, any>;
  inputs: string[];
  outputs: string[];
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

class WorkflowCompiler {
  compile(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
    const adjacencyList = this.buildAdjacencyList(edges);
    const sortedNodes = this.topologicalSort(nodes, adjacencyList);
    
    return {
      nodes: sortedNodes,
      edges,
      entryPoint: this.findEntryPoint(nodes, edges)
    };
  }

  private buildAdjacencyList(edges: WorkflowEdge[]): Map<string, string[]> {
    const list = new Map<string, string[]>();
    
    for (const edge of edges) {
      const targets = list.get(edge.source) || [];
      targets.push(edge.target);
      list.set(edge.source, targets);
    }
    
    return list;
  }

  private topologicalSort(nodes: WorkflowNode[], adjacencyList: Map<string, string[]>): WorkflowNode[] {
    const inDegree = new Map<string, number>();
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    
    for (const node of nodes) {
      inDegree.set(node.id, 0);
    }
    
    for (const [, targets] of adjacencyList) {
      for (const target of targets) {
        inDegree.set(target, (inDegree.get(target) || 0) + 1);
      }
    }
    
    const queue = nodes.filter(n => inDegree.get(n.id) === 0);
    const result: WorkflowNode[] = [];
    
    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node);
      
      const targets = adjacencyList.get(node.id) || [];
      for (const target of targets) {
        const newDegree = (inDegree.get(target) || 0) - 1;
        inDegree.set(target, newDegree);
        if (newDegree === 0) {
          queue.push(nodeMap.get(target)!);
        }
      }
    }
    
    return result;
  }
}
```

#### 3. 工具库管理

```typescript
// toolRegistry.ts
interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'search' | 'code' | 'data' | 'api';
  parameters: JSONSchema;
  execute: (params: Record<string, any>) => Promise<any>;
}

class ToolRegistry {
  private tools: Map<string, Tool> = new Map();

  register(tool: Tool): void {
    this.tools.set(tool.id, tool);
  }

  getTool(id: string): Tool | undefined {
    return this.tools.get(id);
  }

  getToolsByCategory(category: Tool['category']): Tool[] {
    return Array.from(this.tools.values()).filter(t => t.category === category);
  }

  getToolDefinitions(): Array<{ type: 'function'; function: any }> {
    return Array.from(this.tools.values()).map(tool => ({
      type: 'function' as const,
      function: {
        name: tool.id,
        description: tool.description,
        parameters: tool.parameters
      }
    }));
  }
}

// 预置工具
const defaultTools: Tool[] = [
  {
    id: 'web_search',
    name: '网络搜索',
    description: '在互联网上搜索信息',
    category: 'search',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '搜索关键词' },
        limit: { type: 'number', description: '返回结果数量', default: 5 }
      },
      required: ['query']
    },
    execute: async (params) => {
      // 实现搜索逻辑
      return { results: [] };
    }
  },
  {
    id: 'execute_code',
    name: '代码执行',
    description: '执行Python代码',
    category: 'code',
    parameters: {
      type: 'object',
      properties: {
        code: { type: 'string', description: '要执行的Python代码' },
        timeout: { type: 'number', description: '超时时间(秒)', default: 30 }
      },
      required: ['code']
    },
    execute: async (params) => {
      // 实现代码执行逻辑
      return { output: '' };
    }
  }
];
```

### 技术难点与解决方案

| 难点 | 解决方案 |
|------|----------|
| 工作流DAG验证 | 实现拓扑排序算法检测环路，确保工作流无死锁；支持节点连接规则验证 |
| 工具调用安全性 | 实现工具权限控制和参数校验，敏感操作需人工确认；添加执行超时机制 |
| 多Agent协作状态同步 | 使用XState状态机管理Agent状态，实现状态持久化和恢复 |
| 可视化编辑器性能 | 虚拟化渲染大量节点，使用Web Worker处理复杂计算 |

### 项目成果

- 支持10+种节点类型（LLM、工具、条件、循环、并行等）
- 工作流执行成功率99%+，平均执行时间<5秒
- 支持工作流版本管理和回滚，企业级稳定性
- 企业客户20+，累计创建工作流5000+
- 个人贡献：负责可视化编辑器和执行引擎核心模块

### 面试回答示例

这是一个**低代码AI Agent平台**项目，类似Coze/Dify，主要解决企业快速构建AI工作流的需求。

技术选型上，我们选择了**Vue 3 + Vue Flow + XState + LangGraph**，原因是：Vue Flow提供成熟的流程图编辑能力，XState适合复杂状态管理，LangGraph是生产级Agent框架。

我主要负责**可视化编辑器和工作流执行引擎**，其中最关键的挑战是**工作流的DAG验证和执行调度**。

我的解决方案是**实现WorkflowCompiler编译器**，具体实现包括：
1. 使用拓扑排序算法验证工作流无环路
2. 实现节点并行执行和依赖调度
3. 封装工具注册中心，支持动态扩展工具

最终项目取得了**企业客户20+、工作流执行成功率99%+**的成绩，我的主要贡献是**设计并实现可视化编辑器和执行引擎**。

---

## 项目三：AI面试官

### 项目概述

**项目名称：** 智能面试助手

**项目描述：** 基于RAG的AI面试系统，支持简历解析、智能提问、实时评估、面试报告生成。

**技术栈：**
- 前端：React 18 + TypeScript + Ant Design
- 后端：Node.js + Express
- AI：OpenAI GPT-4o + RAG
- 向量数据库：ChromaDB
- 文件处理：PDF解析、Word解析

### 核心功能

```
┌─────────────────────────────────────────────────────────┐
│                    AI面试官架构                          │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │              面试流程                            │   │
│  │  简历上传 → 岗位匹配 → 智能提问 → 实时评估      │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↓                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  简历解析   │  │  题库RAG    │  │  评估模型   │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                         ↓                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │              报告生成                            │   │
│  │  能力雷达图 + 问题分析 + 改进建议               │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 技术亮点

#### 1. 简历解析与结构化

```typescript
// resumeParser.ts
interface Resume {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location?: string;
  };
  education: Array<{
    school: string;
    degree: string;
    major: string;
    startDate: string;
    endDate: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string[];
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    role: string;
    description: string;
    technologies: string[];
  }>;
}

class ResumeParser {
  async parse(file: File): Promise<Resume> {
    const text = await this.extractText(file);
    const structured = await this.structureWithLLM(text);
    return structured;
  }

  private async extractText(file: File): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return this.extractFromPDF(file);
      case 'docx':
        return this.extractFromDocx(file);
      default:
        return await file.text();
    }
  }

  private async structureWithLLM(text: string): Promise<Resume> {
    const prompt = `
请将以下简历内容解析为结构化JSON格式：

简历内容：
${text}

请返回以下格式的JSON：
{
  "personalInfo": { "name": "", "email": "", "phone": "", "location": "" },
  "education": [{ "school": "", "degree": "", "major": "", "startDate": "", "endDate": "" }],
  "experience": [{ "company": "", "position": "", "startDate": "", "endDate": "", "description": [] }],
  "skills": [],
  "projects": [{ "name": "", "role": "", "description": "", "technologies": [] }]
}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }
}
```

#### 2. 智能提问系统

```typescript
// questionGenerator.ts
interface Question {
  id: string;
  category: 'technical' | 'project' | 'behavioral' | 'algorithm';
  difficulty: 'easy' | 'medium' | 'hard';
  content: string;
  followUp?: string[];
  evaluationCriteria: string[];
}

class QuestionGenerator {
  private questionBank: VectorStore;

  async generateQuestions(resume: Resume, position: string): Promise<Question[]> {
    const questions: Question[] = [];

    // 基于简历生成个性化问题
    for (const exp of resume.experience) {
      const techQuestions = await this.generateTechQuestions(exp, position);
      questions.push(...techQuestions);
    }

    // 从题库检索相关问题
    const query = `${position} 前端开发 技术面试题`;
    const bankQuestions = await this.questionBank.search(query, 5);
    questions.push(...bankQuestions);

    // 去重和难度平衡
    return this.balanceQuestions(questions);
  }

  private async generateTechQuestions(
    experience: Resume['experience'][0],
    position: string
  ): Promise<Question[]> {
    const prompt = `
基于以下工作经历，生成3-5个技术面试问题：

公司：${experience.company}
职位：${experience.position}
工作内容：${experience.description.join('\n')}

要求：
1. 问题要有深度，考察实际能力
2. 包含1-2个追问
3. 提供评估标准

请返回JSON数组格式。
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content || '[]');
  }
}
```

#### 3. 实时评估系统

```typescript
// evaluator.ts
interface Evaluation {
  questionId: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  followUpNeeded: boolean;
}

class InterviewEvaluator {
  async evaluate(
    question: Question,
    answer: string,
    conversationHistory: Message[]
  ): Promise<Evaluation> {
    const prompt = `
你是一位资深的技术面试官，请评估候选人的回答。

面试问题：
${question.content}

问题类型：${question.category}
难度：${question.difficulty}
评估标准：${question.evaluationCriteria.join(', ')}

候选人回答：
${answer}

对话历史：
${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}

请返回以下JSON格式：
{
  "score": <1-10>,
  "strengths": ["优点1", "优点2"],
  "weaknesses": ["不足1", "不足2"],
  "suggestions": ["建议1", "建议2"],
  "followUpNeeded": <true/false>
}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  generateReport(evaluations: Evaluation[]): InterviewReport {
    const categories = this.groupByCategory(evaluations);
    
    return {
      overallScore: this.calculateOverallScore(evaluations),
      categoryScores: this.calculateCategoryScores(categories),
      strengths: this.aggregateStrengths(evaluations),
      weaknesses: this.aggregateWeaknesses(evaluations),
      recommendations: this.generateRecommendations(evaluations),
      radarChart: this.generateRadarData(categories)
    };
  }
}
```

#### 4. 面试报告生成

```typescript
// reportGenerator.ts
interface InterviewReport {
  overallScore: number;
  categoryScores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  radarChart: RadarChartData;
}

interface RadarChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
  }>;
}

class ReportGenerator {
  generateReport(evaluations: Evaluation[], resume: Resume): InterviewReport {
    const categories = this.groupByCategory(evaluations);
    
    return {
      overallScore: this.calculateOverallScore(evaluations),
      categoryScores: {
        '技术基础': this.avgScore(categories.technical || []),
        '项目经验': this.avgScore(categories.project || []),
        '算法能力': this.avgScore(categories.algorithm || []),
        '沟通表达': this.avgScore(categories.behavioral || [])
      },
      strengths: this.extractTopStrengths(evaluations, 3),
      weaknesses: this.extractTopWeaknesses(evaluations, 3),
      recommendations: this.generateRecommendations(evaluations, resume),
      radarChart: {
        labels: ['技术基础', '项目经验', '算法能力', '沟通表达', '学习能力', '团队协作'],
        datasets: [{
          label: '能力评估',
          data: this.calculateRadarData(evaluations)
        }]
      }
    };
  }

  generateRecommendations(
    evaluations: Evaluation[],
    resume: Resume
  ): string[] {
    const recommendations: string[] = [];
    
    const weakCategories = this.identifyWeakCategories(evaluations);
    
    for (const category of weakCategories) {
      switch (category) {
        case 'technical':
          recommendations.push('建议加强前端基础知识的系统学习，特别是JavaScript核心概念');
          break;
        case 'algorithm':
          recommendations.push('建议每天练习1-2道算法题，重点掌握常见数据结构');
          break;
        case 'project':
          recommendations.push('建议深入理解项目的技术选型和架构设计原理');
          break;
      }
    }
    
    return recommendations;
  }
}
```

### 技术难点与解决方案

| 难点 | 解决方案 |
|------|----------|
| 简历解析准确率 | 结合规则解析和LLM结构化提取，多轮校验确保关键字段准确 |
| 面试问题个性化 | 基于简历+岗位构建RAG检索，动态生成针对性问题 |
| 实时评估一致性 | 设计结构化评估Prompt，多维度打分减少主观偏差 |
| 长对话上下文管理 | 实现对话摘要压缩，保留关键信息同时控制Token消耗 |

### 项目成果

- 简历解析准确率95%+，支持PDF/Word/图片格式
- 面试评估与人工评估一致性85%+，可信度高
- 支持前端、后端、算法、产品等10+岗位
- 累计面试场次10000+，用户满意度4.5/5
- 个人贡献：负责RAG检索系统和评估模型设计

### 面试回答示例

这是一个**AI面试系统**项目，基于RAG技术，主要解决企业招聘效率低、面试标准化难的问题。

技术选型上，我们选择了**React + ChromaDB + GPT-4o**，原因是：ChromaDB轻量适合中小规模向量检索，GPT-4o能力强适合复杂评估任务。

我主要负责**RAG检索系统和评估模型**，其中最关键的挑战是**面试问题的个性化生成和实时评估的一致性**。

我的解决方案是**设计结构化的评估Pipeline**，具体实现包括：
1. 构建岗位-技能-问题的知识图谱，实现精准检索
2. 设计多维度评估Prompt，包含技术深度、表达能力等维度
3. 实现对话摘要压缩，在长面试中保持上下文连贯

最终项目取得了**简历解析准确率95%+、评估一致性85%+**的成绩，我的主要贡献是**设计RAG架构和评估模型**。

---

## 项目四：多模态AI助手

### 项目概述

**项目名称：** 智能多模态交互平台

**项目描述：** 支持文本、图像、语音多模态交互的AI助手，实现图文理解、语音对话、图像生成等能力。

**技术栈：**
- 前端：React 18 + TypeScript + Tailwind CSS
- 音频处理：Web Audio API + MediaRecorder
- 图像处理：Canvas API + FileReader
- AI模型：GPT-4o（多模态）、Whisper（语音识别）、TTS（语音合成）
- 后端：Node.js + Express

### 核心功能

```
┌─────────────────────────────────────────────────────────┐
│                  多模态AI助手架构                        │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │              多模态输入                          │   │
│  │  📝 文本  │  🖼️ 图像  │  🎤 语音  │  📹 视频   │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↓                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │              模态处理层                          │   │
│  │  OCR识别 │ 图像理解 │ 语音转文字 │ 视频抽帧    │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↓                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  多模态LLM  │  │  图像生成   │  │  语音合成   │    │
│  │  (GPT-4o)   │  │  (DALL-E)   │  │  (TTS)      │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 技术亮点

#### 1. 图像上传与理解

```typescript
// useImageUpload.ts
import { useState, useCallback } from 'react';

interface ImageMessage {
  type: 'image';
  url: string;
  base64: string;
  mimeType: string;
}

export function useImageUpload() {
  const [images, setImages] = useState<ImageMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const uploadImage = useCallback(async (file: File): Promise<ImageMessage> => {
    setIsProcessing(true);
    
    try {
      const base64 = await fileToBase64(file);
      const url = URL.createObjectURL(file);
      
      const imageMessage: ImageMessage = {
        type: 'image',
        url,
        base64: base64.split(',')[1],
        mimeType: file.type
      };
      
      setImages(prev => [...prev, imageMessage]);
      return imageMessage;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const analyzeImage = useCallback(async (image: ImageMessage, prompt: string) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:${image.mimeType};base64,${image.base64}`,
                detail: 'auto'
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });
    
    return response.choices[0].message.content;
  }, []);

  const pasteFromClipboard = useCallback(async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      
      for (const item of clipboardItems) {
        const imageType = item.types.find(type => type.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], 'pasted-image.png', { type: imageType });
          return await uploadImage(file);
        }
      }
    } catch (error) {
      console.error('剪贴板粘贴失败:', error);
    }
  }, [uploadImage]);

  return { images, isProcessing, uploadImage, analyzeImage, pasteFromClipboard };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

#### 2. 语音录制与识别

```typescript
// useVoiceRecorder.ts
import { useState, useRef, useCallback } from 'react';

interface VoiceRecorderState {
  isRecording: boolean;
  isProcessing: boolean;
  audioUrl: string | null;
  transcript: string | null;
}

export function useVoiceRecorder() {
  const [state, setState] = useState<VoiceRecorderState>({
    isRecording: false,
    isProcessing: false,
    audioUrl: null,
    transcript: null
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setState(prev => ({ 
          ...prev, 
          audioUrl,
          isProcessing: true 
        }));
        
        const transcript = await transcribeAudio(audioBlob);
        
        setState(prev => ({ 
          ...prev, 
          transcript,
          isProcessing: false 
        }));
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setState(prev => ({ ...prev, isRecording: true }));
    } catch (error) {
      console.error('录音启动失败:', error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      setState(prev => ({ ...prev, isRecording: false }));
    }
  }, [state.isRecording]);

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'zh');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: formData
    });

    const data = await response.json();
    return data.text;
  };

  return {
    ...state,
    startRecording,
    stopRecording
  };
}
```

#### 3. 语音合成（TTS）

```typescript
// useTextToSpeech.ts
import { useState, useCallback, useRef } from 'react';

interface TTSOptions {
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  speed?: number;
}

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async (text: string, options: TTSOptions = {}) => {
    const { voice = 'alloy', speed = 1.0 } = options;
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice,
          speed,
          response_format: 'mp3'
        })
      });

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
      
      await audio.play();
    } catch (error) {
      console.error('语音合成失败:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
    }
  }, []);

  return { isSpeaking, isProcessing, speak, stop };
}
```

#### 4. 图像生成

```typescript
// useImageGeneration.ts
import { useState, useCallback } from 'react';

interface GeneratedImage {
  url: string;
  revisedPrompt?: string;
}

export function useImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);

  const generateImage = useCallback(async (prompt: string, options: {
    size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
    quality?: 'standard' | 'hd';
    n?: number;
  } = {}) => {
    const { size = '1024x1024', quality = 'standard', n = 1 } = options;
    
    setIsGenerating(true);
    
    try {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        n,
        size,
        quality
      });

      const newImages = response.data.map(img => ({
        url: img.url,
        revisedPrompt: img.revised_prompt
      }));
      
      setImages(prev => [...prev, ...newImages]);
      return newImages;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const editImage = useCallback(async (
    imageFile: File,
    prompt: string,
    maskFile?: File
  ) => {
    setIsGenerating(true);
    
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('prompt', prompt);
      if (maskFile) {
        formData.append('mask', maskFile);
      }
      formData.append('model', 'dall-e-2');
      formData.append('n', '1');
      formData.append('size', '1024x1024');

      const response = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: formData
      });

      const data = await response.json();
      return data.data[0].url;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { images, isGenerating, generateImage, editImage };
}
```

#### 5. 多模态消息渲染

```tsx
// MultimodalMessage.tsx
import React from 'react';

interface MessageContent {
  type: 'text' | 'image' | 'audio' | 'image_generation';
  content: string;
  metadata?: {
    mimeType?: string;
    revisedPrompt?: string;
    duration?: number;
  };
}

interface MultimodalMessageProps {
  role: 'user' | 'assistant';
  contents: MessageContent[];
  onPlayAudio?: (url: string) => void;
}

export function MultimodalMessage({ role, contents, onPlayAudio }: MultimodalMessageProps) {
  return (
    <div className={`message ${role}`}>
      {contents.map((content, index) => {
        switch (content.type) {
          case 'text':
            return (
              <div key={index} className="text-content">
                {content.content}
              </div>
            );
          
          case 'image':
            return (
              <div key={index} className="image-content">
                <img 
                  src={content.content} 
                  alt="用户上传图片"
                  onClick={() => window.open(content.content, '_blank')}
                />
              </div>
            );
          
          case 'audio':
            return (
              <div key={index} className="audio-content">
                <audio controls src={content.content} />
                {content.metadata?.duration && (
                  <span className="duration">
                    {formatDuration(content.metadata.duration)}
                  </span>
                )}
              </div>
            );
          
          case 'image_generation':
            return (
              <div key={index} className="generated-image">
                <img src={content.content} alt="AI生成图片" />
                {content.metadata?.revisedPrompt && (
                  <p className="revised-prompt">
                    优化后的提示词: {content.metadata.revisedPrompt}
                  </p>
                )}
              </div>
            );
          
          default:
            return null;
        }
      })}
    </div>
  );
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

### 技术难点与解决方案

| 难点 | 解决方案 |
|------|----------|
| 大图像上传性能 | 实现图像压缩和分片上传，支持拖拽、粘贴多种输入方式 |
| 语音识别准确率 | 使用Whisper模型，结合VAD静音检测优化录音质量 |
| 多模态消息渲染 | 设计统一的消息数据结构，支持文本、图像、音频混合渲染 |
| TTS语音自然度 | 支持多种音色选择，调整语速和情感参数优化体验 |

### 项目成果

- 支持文本、图像、语音三种模态输入，覆盖主流交互场景
- 图像理解准确率92%+，支持OCR、场景识别、图表分析
- 语音识别准确率95%+，支持中英文混合识别
- 支持中英文语音合成，6种音色可选
- 日均多模态交互10000+次，用户留存率60%+
- 个人贡献：负责多模态输入组件和消息渲染系统

### 面试回答示例

这是一个**多模态AI助手**项目，主要解决用户需要通过多种方式（文字、图片、语音）与AI交互的需求。

技术选型上，我们选择了**React + GPT-4o + Whisper + TTS**，原因是：GPT-4o支持多模态输入，Whisper是业界最好的开源语音识别模型，OpenAI TTS语音自然度高。

我主要负责**多模态输入组件和消息渲染系统**，其中最关键的挑战是**多种输入方式的统一处理和实时响应**。

我的解决方案是**设计统一的多模态消息结构**，具体实现包括：
1. 封装useImageUpload、useVoiceRecorder、useTextToSpeech等Hooks
2. 设计MessageContent统一数据结构，支持混合内容渲染
3. 实现剪贴板粘贴图片、拖拽上传等多种输入方式

最终项目取得了**日均交互10000+、用户留存60%+**的成绩，我的主要贡献是**设计多模态交互架构和核心组件开发**。

---

## 项目五：企业知识库RAG系统

### 项目概述

**项目名称：** 企业智能知识库平台

**项目描述：** 基于RAG的企业知识管理系统，支持多格式文档导入、智能问答、知识图谱构建，应用于企业内部知识沉淀与检索场景。

**技术栈：**
- 前端：React 18 + TypeScript + Ant Design
- 后端：Python + FastAPI
- 向量数据库：Milvus
- Embedding：bge-large-zh
- LLM：DeepSeek / GPT-4o
- 文档处理：LangChain + Unstructured

### 核心功能

```
┌─────────────────────────────────────────────────────────┐
│                  企业知识库架构                          │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │              文档处理管道                        │   │
│  │  上传 → 解析 → 分块 → Embedding → 存储         │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↓                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  向量检索   │  │  关键词检索 │  │  混合检索   │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                         ↓                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │              RAG生成 + 引用溯源                  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 技术亮点

#### 1. 多格式文档解析

```typescript
// documentProcessor.ts
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

interface ProcessedDocument {
  id: string;
  content: string;
  metadata: {
    source: string;
    page?: number;
    chunkIndex: number;
    createdAt: Date;
  };
}

class DocumentProcessor {
  private splitter: RecursiveCharacterTextSplitter;

  constructor() {
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
      separators: ['\n\n', '\n', '。', '！', '？', '；', ' ', '']
    });
  }

  async process(file: File): Promise<ProcessedDocument[]> {
    const text = await this.extractText(file);
    const chunks = await this.splitter.splitText(text);
    
    return chunks.map((chunk, index) => ({
      id: `${file.name}_${index}`,
      content: chunk,
      metadata: {
        source: file.name,
        chunkIndex: index,
        createdAt: new Date()
      }
    }));
  }

  private async extractText(file: File): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return this.extractPDF(file);
      case 'docx':
        return this.extractDocx(file);
      case 'xlsx':
        return this.extractExcel(file);
      case 'pptx':
        return this.extractPPT(file);
      case 'md':
      case 'txt':
        return await file.text();
      default:
        throw new Error(`不支持的文件格式: ${extension}`);
    }
  }

  private async extractPDF(file: File): Promise<string> {
    const loader = new UnstructuredLoader(file, {
      strategy: 'hi_res',
      apiKey: process.env.UNSTRUCTURED_API_KEY
    });
    const docs = await loader.load();
    return docs.map(d => d.pageContent).join('\n');
  }

  private async extractExcel(file: File): Promise<string> {
    const XLSX = await import('xlsx');
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    
    let text = '';
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      text += `## ${sheetName}\n`;
      text += XLSX.utils.sheet_to_csv(sheet);
      text += '\n\n';
    }
    
    return text;
  }
}
```

#### 2. 混合检索实现

```typescript
// hybridRetriever.ts
interface SearchResult {
  id: string;
  content: string;
  score: number;
  source: string;
  metadata: Record<string, any>;
}

class HybridRetriever {
  private vectorStore: MilvusStore;
  private keywordIndex: ElasticSearchClient;
  private embeddingModel: EmbeddingModel;

  async search(query: string, topK: number = 10): Promise<SearchResult[]> {
    const [vectorResults, keywordResults] = await Promise.all([
      this.vectorSearch(query, topK * 2),
      this.keywordSearch(query, topK * 2)
    ]);

    const merged = this.rrfMerge(vectorResults, keywordResults);
    return merged.slice(0, topK);
  }

  private async vectorSearch(query: string, topK: number): Promise<SearchResult[]> {
    const queryEmbedding = await this.embeddingModel.embed(query);
    
    const results = await this.vectorStore.similaritySearch(
      queryEmbedding,
      topK
    );
    
    return results.map(r => ({
      id: r.id,
      content: r.content,
      score: r.score,
      source: r.metadata.source,
      metadata: r.metadata
    }));
  }

  private async keywordSearch(query: string, topK: number): Promise<SearchResult[]> {
    const results = await this.keywordIndex.search({
      index: 'knowledge_base',
      body: {
        query: {
          bool: {
            should: [
              { match: { content: query } },
              { match: { content: { query, fuzziness: 'AUTO' } } }
            ]
          }
        },
        size: topK
      }
    });
    
    return results.hits.hits.map(hit => ({
      id: hit._id,
      content: hit._source.content,
      score: hit._score,
      source: hit._source.source,
      metadata: hit._source.metadata
    }));
  }

  private rrfMerge(
    vectorResults: SearchResult[],
    keywordResults: SearchResult[],
    k: number = 60
  ): SearchResult[] {
    const scores = new Map<string, { result: SearchResult; score: number }>();
    
    vectorResults.forEach((result, index) => {
      const rrfScore = 1 / (k + index + 1);
      const existing = scores.get(result.id);
      if (existing) {
        existing.score += rrfScore;
      } else {
        scores.set(result.id, { result, score: rrfScore });
      }
    });
    
    keywordResults.forEach((result, index) => {
      const rrfScore = 1 / (k + index + 1);
      const existing = scores.get(result.id);
      if (existing) {
        existing.score += rrfScore;
      } else {
        scores.set(result.id, { result, score: rrfScore });
      }
    });
    
    return Array.from(scores.values())
      .sort((a, b) => b.score - a.score)
      .map(item => ({ ...item.result, score: item.score }));
  }
}
```

#### 3. RAG问答与引用溯源

```typescript
// ragQA.ts
interface RAGResponse {
  answer: string;
  sources: Array<{
    content: string;
    source: string;
    page?: number;
    relevance: number;
  }>;
  confidence: number;
}

class RAGQA {
  private retriever: HybridRetriever;
  private llm: LLMClient;
  private reranker: Reranker;

  async answer(question: string): Promise<RAGResponse> {
    const searchResults = await this.retriever.search(question, 10);
    const rerankedResults = await this.reranker.rerank(question, searchResults, 5);
    
    const context = rerankedResults.map(r => r.content).join('\n\n---\n\n');
    
    const prompt = this.buildPrompt(question, context);
    
    const response = await this.llm.generate(prompt);
    
    return {
      answer: response.content,
      sources: rerankedResults.map(r => ({
        content: r.content,
        source: r.metadata.source,
        page: r.metadata.page,
        relevance: r.score
      })),
      confidence: this.calculateConfidence(rerankedResults)
    };
  }

  private buildPrompt(question: string, context: string): string {
    return `你是一个专业的企业知识库助手。请基于以下参考资料回答问题。

## 参考资料
${context}

## 回答要求
1. 仅基于参考资料回答，不要编造信息
2. 如果参考资料中没有相关信息，请明确说明
3. 回答时标注引用来源，格式为[来源:文件名]
4. 回答要简洁、准确、有条理

## 问题
${question}

## 回答`;
  }

  private calculateConfidence(results: SearchResult[]): number {
    if (results.length === 0) return 0;
    
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    const topScore = results[0].score;
    
    return Math.min(1, (avgScore + topScore) / 2 * 1.2);
  }
}
```

#### 4. 知识图谱构建

```typescript
// knowledgeGraph.ts
interface Entity {
  id: string;
  name: string;
  type: string;
  properties: Record<string, any>;
}

interface Relation {
  id: string;
  source: string;
  target: string;
  type: string;
  properties: Record<string, any>;
}

class KnowledgeGraphBuilder {
  private llm: LLMClient;

  async buildFromDocument(content: string): Promise<{ entities: Entity[]; relations: Relation[] }> {
    const prompt = `
请从以下文本中提取实体和关系：

文本：
${content}

请以JSON格式返回：
{
  "entities": [
    { "name": "实体名称", "type": "实体类型", "properties": {} }
  ],
  "relations": [
    { "source": "实体1", "target": "实体2", "type": "关系类型" }
  ]
}
`;

    const response = await this.llm.generate(prompt);
    const result = JSON.parse(response.content);
    
    const entities = result.entities.map((e: any, i: number) => ({
      id: `entity_${i}`,
      ...e
    }));
    
    const relations = result.relations.map((r: any, i: number) => ({
      id: `relation_${i}`,
      source: entities.find(e => e.name === r.source)?.id,
      target: entities.find(e => e.name === r.target)?.id,
      type: r.type
    })).filter((r: any) => r.source && r.target);
    
    return { entities, relations };
  }

  async queryGraph(query: string): Promise<string> {
    const prompt = `
用户问题：${query}

请分析问题需要查询的知识图谱路径，并生成Cypher查询语句。
`;

    const response = await this.llm.generate(prompt);
    return response.content;
  }
}
```

### 技术难点与解决方案

| 难点 | 解决方案 |
|------|----------|
| 文档解析格式多样 | 使用Unstructured库统一处理，支持PDF/Word/Excel/PPT等10+格式 |
| 检索准确率不高 | 实现混合检索（向量+关键词），使用RRF算法融合排序 |
| 回答引用溯源 | 设计引用标注Prompt，在回答中标注来源文件和段落 |
| 知识库实时更新 | 实现增量索引，支持文档增删改的实时同步 |

### 项目成果

- 支持10+种文档格式解析，解析成功率98%+
- 检索准确率提升40%（混合检索vs纯向量检索）
- 知识库文档量100万+，检索响应<2秒
- 企业客户50+，覆盖金融、医疗、教育等行业
- 平均响应时间<2秒，用户满意度4.6/5
- 个人贡献：负责混合检索引擎和RAG问答模块

### 面试回答示例

这是一个**企业知识库RAG系统**项目，主要解决企业内部知识分散、检索效率低的问题。

技术选型上，我们选择了**React + FastAPI + Milvus + bge-large-zh**，原因是：Milvus高性能适合大规模向量检索，bge-large-zh中文效果好且免费，FastAPI异步性能强。

我主要负责**混合检索引擎和RAG问答模块**，其中最关键的挑战是**提高检索准确率和回答的可信度**。

我的解决方案是**实现混合检索和引用溯源**，具体实现包括：
1. 实现向量检索+关键词检索的混合策略，使用RRF算法融合
2. 设计引用标注Prompt，让AI在回答中标注来源
3. 实现增量索引机制，支持知识库实时更新

最终项目取得了**检索准确率提升40%、企业客户50+**的成绩，我的主要贡献是**设计混合检索架构和RAG问答流程**。

---

## 项目经验总结模板

### 项目描述模板

```markdown
## 项目名称

### 项目背景
- 项目目标
- 业务场景
- 团队规模

### 技术选型
- 前端技术栈
- 后端技术栈
- AI相关技术

### 核心功能
1. 功能一
2. 功能二
3. 功能三

### 技术难点与解决方案
| 难点 | 解决方案 |
|------|----------|
| 难点1 | 方案1 |
| 难点2 | 方案2 |

### 项目成果
- 核心指标
- 业务价值
- 个人贡献
```

### 面试回答模板

```markdown
这是一个[项目类型]项目，主要解决[业务问题]。

技术选型上，我们选择了[技术栈]，原因是[选择理由]。

我主要负责[核心模块]，其中最关键的挑战是[技术难点]。

我的解决方案是[具体方案]，具体实现包括：
1. [实现细节1]
2. [实现细节2]

最终项目取得了[成果指标]，我的主要贡献是[个人贡献]。
```
