# AI前端项目经验模板

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

### 项目成果

- 支持3种主流大模型切换
- 流式输出延迟<100ms
- 支持对话历史导出/导入
- 日活用户5000+

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

```vue
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

### 项目成果

- 支持10+种节点类型
- 工作流执行成功率99%+
- 支持工作流版本管理
- 企业客户20+

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

### 项目成果

- 简历解析准确率95%+
- 面试评估与人工评估一致性85%+
- 支持前端、后端、算法等岗位
- 累计面试场次10000+

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
