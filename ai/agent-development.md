# AI Agent 开发

## 一、Agent 概述

### 1.1 什么是AI Agent？

AI Agent（智能代理）是能够自主感知环境、做出决策并执行动作以实现目标的AI系统。与传统的单一对话不同，Agent具备：
- **自主决策**：根据目标自主规划行动步骤
- **工具调用**：使用外部工具扩展能力边界
- **记忆能力**：记住历史交互和状态
- **多步推理**：分解复杂任务为多个子任务

### 1.2 Agent vs 传统LLM应用

| 特性 | 传统LLM应用 | AI Agent |
|------|-------------|----------|
| 交互模式 | 单轮问答 | 多轮任务执行 |
| 能力边界 | 仅文本生成 | 可调用工具、执行操作 |
| 决策能力 | 无 | 自主规划和决策 |
| 状态管理 | 无状态 | 有状态、有记忆 |
| 任务复杂度 | 简单任务 | 复杂多步骤任务 |

## 二、Agent 架构

### 2.1 核心组件

```
┌─────────────────────────────────────────┐
│              Agent System               │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │  Brain  │  │ Memory  │  │  Tools  │ │
│  │  (LLM)  │  │         │  │         │ │
│  └─────────┘  └─────────┘  └─────────┘ │
│       ↓            ↓            ↓      │
│  ┌───────────────────────────────────┐ │
│  │           Planner/Executor        │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**核心组件说明：**

1. **Brain（大脑）**：LLM作为决策核心
2. **Memory（记忆）**：短期记忆 + 长期记忆
3. **Tools（工具）**：搜索引擎、代码执行、API调用等
4. **Planner（规划器）**：任务分解与规划
5. **Executor（执行器）**：执行具体动作

### 2.2 ReAct 模式

ReAct（Reasoning + Acting）是最经典的Agent模式：

> **💡 ReAct**（推理+行动）：一种让AI交替进行思考和行动的模式。
> - **通俗解释**：让AI像人一样，先想"我该怎么做"，然后去做，做完看看结果，再想下一步该怎么做。
> - **例子**：就像你要做一道菜，先想"需要什么食材"（Reasoning），然后去买菜（Acting），回来发现少了盐，再想"可以用酱油代替"（Reasoning），继续做菜（Acting）。

```
用户输入 → 思考(Reasoning) → 行动(Acting) → 观察(Observation) → 循环...
```

**示例流程：**
```
用户：帮我查一下北京明天的天气，如果会下雨就推荐一些室内活动

思考1: 我需要先查询北京明天的天气
行动1: 调用天气API，查询北京明天天气
观察1: 北京明天小雨，气温15-20℃

思考2: 明天会下雨，需要推荐室内活动
行动2: 搜索北京室内活动推荐
观察2: 获得室内活动列表

思考3: 我已经获得了所需信息，可以回答用户了
最终回答: 北京明天有小雨...
```

## 三、主流Agent框架

### 3.1 LangChain

**特点：** 最流行的LLM应用开发框架，模块化设计

> **💡 LangChain**：一个帮助快速开发LLM应用的框架，提供各种现成的组件。
> - **通俗解释**：就像一个"AI应用开发工具箱"，里面有各种现成的零件，你只需要组装就能做出AI应用。
> - **例子**：你想做一个能查天气的AI助手，LangChain提供了"调用API"、"记忆对话"、"处理返回结果"等现成模块，你只需要配置一下就能用。

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { pull } from 'langchain/hub';
import { DynamicTool } from '@langchain/core/tools';

const model = new ChatOpenAI({ model: 'gpt-4o' });

const tools = [
  new DynamicTool({
    name: 'calculator',
    description: '用于数学计算',
    func: async (input) => eval(input).toString()
  })
];

const prompt = await pull('hwchase17/openai-functions-agent');
const agent = await createOpenAIFunctionsAgent({ llm: model, tools, prompt });
const agentExecutor = new AgentExecutor({ agent, tools });
```

### 3.2 LangGraph

**特点：** 状态机工作流编排，适合复杂Agent

> **💡 LangGraph**：LangChain的扩展，用于构建有状态、可循环的复杂AI工作流。
> - **通俗解释**：如果说LangChain是"直线流程"，LangGraph就是"流程图"，可以有分支、循环、条件判断。
> - **例子**：一个客服AI，用户可能问问题、也可能投诉、也可能退货，LangGraph可以根据不同情况走不同的处理流程，还能循环回到上一步重新处理。

> **💡 状态机**（State Machine）：一种编程模式，系统在不同"状态"之间切换。
> - **通俗解释**：就像红绿灯，有红、黄、绿三种状态，按规则切换。AI工作流也可以有"等待输入"、"处理中"、"等待确认"、"完成"等状态。
> - **例子**：订单处理系统：待支付→已支付→发货中→已送达，每个状态只能转换到特定的下一个状态。

> **💡 DAG**（Directed Acyclic Graph，有向无环图）：一种没有循环的流程图结构。
> - **通俗解释**：像一条只能往前走的路，不能回头，也不会绕圈。每个步骤完成后进入下一步，直到结束。
> - **例子**：数据处理流程：读取数据→清洗数据→转换数据→存储结果，只能按这个顺序走，不能跳回去。

```javascript
import { StateGraph, END } from '@langchain/langgraph';

const workflow = new StateGraph({ channels: { messages: { value: (x, y) => x.concat(y) } } });

workflow.addNode('agent', agentNode);
workflow.addNode('tools', toolNode);

workflow.setEntryPoint('agent');
workflow.addConditionalEdges('agent', shouldContinue, {
  continue: 'tools',
  end: END
});
workflow.addEdge('tools', 'agent');

const app = workflow.compile();
```

### 3.3 框架对比

| 框架 | 特点 | 适用场景 |
|------|------|----------|
| LangChain | 模块化、生态丰富 | 快速原型开发 |
| LangGraph | 状态机、可控性强 | 复杂工作流编排 |
| CrewAI | 多Agent协作 | 多角色协作任务 |
| AutoGPT | 完全自主 | 自主任务执行 |
| Dify | 低代码平台 | 企业级应用开发 |

## 四、工具调用

### 4.1 Function Calling

> **💡 Function Calling**（函数调用）：让LLM能够调用预定义的函数。
> - **通俗解释**：你告诉AI"我有一个查天气的函数"，当用户问天气时，AI会自动调用这个函数，而不是瞎编答案。
> - **例子**：定义一个get_weather(city)函数，用户问"北京天气"，AI会自动识别需要调用这个函数，并传入参数city="北京"。

```javascript
const tools = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: '获取指定城市的天气信息',
      parameters: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: '城市名称'
          }
        },
        required: ['city']
      }
    }
  }
];

const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: '北京今天天气怎么样？' }],
  tools: tools
});

const toolCall = response.choices[0].message.tool_calls[0];
const args = JSON.parse(toolCall.function.arguments);
```

### 4.2 工具定义规范

```javascript
const toolDefinitions = {
  search: {
    name: 'web_search',
    description: '在互联网上搜索信息',
    parameters: {
      query: { type: 'string', description: '搜索关键词' },
      limit: { type: 'number', description: '返回结果数量', default: 5 }
    },
    execute: async (params) => {
      const results = await searchAPI(params.query, params.limit);
      return JSON.stringify(results);
    }
  },
  
  codeExecute: {
    name: 'execute_code',
    description: '执行Python代码',
    parameters: {
      code: { type: 'string', description: '要执行的Python代码' }
    },
    execute: async (params) => {
      return await codeRunner.execute(params.code);
    }
  }
};
```

### 4.3 工具执行器

```javascript
class ToolExecutor {
  constructor(tools) {
    this.tools = new Map(tools.map(t => [t.name, t]));
  }

  async execute(toolCall) {
    const tool = this.tools.get(toolCall.name);
    if (!tool) {
      throw new Error(`Unknown tool: ${toolCall.name}`);
    }
    
    try {
      const result = await tool.execute(toolCall.arguments);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

## 五、记忆系统

### 5.1 记忆类型

```
┌─────────────────────────────────────────┐
│           Agent Memory System           │
├─────────────────────────────────────────┤
│  短期记忆 (Short-term Memory)           │
│  ├── 对话历史                           │
│  └── 当前任务状态                       │
├─────────────────────────────────────────┤
│  长期记忆 (Long-term Memory)            │
│  ├── 向量数据库存储                     │
│  └── 知识图谱                           │
├─────────────────────────────────────────┤
│  工作记忆 (Working Memory)              │
│  ├── 当前上下文                         │
│  └── 中间推理结果                       │
└─────────────────────────────────────────┘
```

> **💡 工作记忆**：当前正在处理的信息，类似于人的"脑力工作台"。
> - **通俗解释**：就像你心算时脑子里暂时存的数字，算完就释放了。
> - **例子**：AI在推理"如果A大于B，B大于C，那么A和C谁大"时，需要在工作记忆中暂存A>B和B>C这两个信息。

> **💡 知识图谱**（Knowledge Graph）：用图结构表示实体之间的关系。
> - **通俗解释**：把知识点连成一张网，显示它们之间的关系。
> - **例子**：知识图谱中，"周杰伦"连接到"歌手"、"台湾人"、"《稻香》"，形成一个关系网络。AI可以通过这个网络回答"周杰伦唱过什么歌"等问题。

### 5.2 记忆实现

```javascript
class AgentMemory {
  constructor() {
    this.shortTerm = [];
    this.longTerm = new VectorStore();
    this.workingMemory = new Map();
  }

  addShortTerm(message) {
    this.shortTerm.push({
      ...message,
      timestamp: Date.now()
    });
  }

  async addLongTerm(content, metadata = {}) {
    await this.longTerm.add(content, metadata);
  }

  async recall(query, topK = 5) {
    return await this.longTerm.search(query, topK);
  }

  getWorkingMemory(key) {
    return this.workingMemory.get(key);
  }

  setWorkingMemory(key, value) {
    this.workingMemory.set(key, value);
  }
}
```

## 六、工作流编排

### 6.1 状态机模式

```javascript
const states = {
  START: 'start',
  PLAN: 'plan',
  EXECUTE: 'execute',
  EVALUATE: 'evaluate',
  END: 'end'
};

class AgentWorkflow {
  constructor() {
    this.state = states.START;
    this.plan = [];
    this.results = [];
  }

  async run(input) {
    while (this.state !== states.END) {
      switch (this.state) {
        case states.START:
          this.state = states.PLAN;
          break;
        case states.PLAN:
          this.plan = await this.createPlan(input);
          this.state = states.EXECUTE;
          break;
        case states.EXECUTE:
          const result = await this.executeStep(this.plan.shift());
          this.results.push(result);
          this.state = this.plan.length ? states.EXECUTE : states.EVALUATE;
          break;
        case states.EVALUATE:
          const success = await this.evaluate(this.results);
          this.state = success ? states.END : states.PLAN;
          break;
      }
    }
    return this.compileResults();
  }
}
```

### 6.2 DAG工作流

```javascript
class DAGWorkflow {
  constructor() {
    this.nodes = new Map();
    this.edges = [];
  }

  addNode(id, executor) {
    this.nodes.set(id, executor);
  }

  addEdge(from, to) {
    this.edges.push({ from, to });
  }

  async execute(inputs) {
    const results = { ...inputs };
    const executed = new Set();
    
    while (executed.size < this.nodes.size) {
      for (const [id, executor] of this.nodes) {
        if (executed.has(id)) continue;
        
        const deps = this.edges.filter(e => e.to === id).map(e => e.from);
        if (deps.every(d => executed.has(d))) {
          results[id] = await executor(results);
          executed.add(id);
        }
      }
    }
    
    return results;
  }
}
```

## 七、前端Agent应用

### 7.1 Agent可视化平台

**核心功能：**
- 工作流可视化编辑
- 节点拖拽配置
- 实时执行预览
- 调试与日志查看

**技术栈：**
- React Flow / Vue Flow：流程图编辑
- XState：状态机管理
- Monaco Editor：代码编辑

### 7.2 前端实现示例

```javascript
import ReactFlow, { useNodesState, useEdgesState } from 'reactflow';

function AgentWorkflowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const nodeTypes = {
    llm: LLMNode,
    tool: ToolNode,
    condition: ConditionNode,
    output: OutputNode
  };

  const onExecute = async () => {
    const workflow = compileWorkflow(nodes, edges);
    const result = await executeWorkflow(workflow);
    console.log(result);
  };

  return (
    <div className="workflow-editor">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
      />
      <button onClick={onExecute}>执行</button>
    </div>
  );
}
```

## 八、面试高频问题

### Q1: Agent和传统ChatBot有什么区别？

**答案要点：**
- ChatBot是被动响应，Agent是主动执行
- Agent有工具调用能力
- Agent有记忆和状态管理
- Agent可以完成多步骤任务
- Agent有规划和决策能力

### Q2: 如何设计一个Agent的工具集？

**答案要点：**
1. 工具功能单一、职责清晰
2. 参数定义完整、有默认值
3. 返回结果格式统一
4. 错误处理完善
5. 提供清晰的描述供LLM理解

### Q3: Agent如何处理执行失败的情况？

**答案要点：**
1. 重试机制：对可重试错误自动重试
2. 回退策略：失败后尝试替代方案
3. 人工介入：关键节点请求人工确认
4. 日志记录：详细记录失败原因
5. 状态恢复：支持从失败点继续执行

### Q4: LangChain和LangGraph的区别？

**答案要点：**
- LangChain：链式调用，适合线性流程
- LangGraph：状态机，适合复杂分支流程
- LangGraph提供更好的可控性和可观测性
- LangGraph支持循环和条件分支
- 两者可以结合使用

### Q5: 如何评估Agent的性能？

**答案要点：**
1. 任务完成率
2. 平均执行步骤数
3. 工具调用成功率
4. 响应时间
5. 资源消耗（API调用次数、Token消耗）
6. 用户满意度
