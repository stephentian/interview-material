# 流式输出技术

## 一、流式输出概述

### 1.1 为什么需要流式输出？

**传统请求-响应模式的问题：**
- LLM生成内容需要时间，用户等待焦虑
- 长文本生成可能导致请求超时
- 用户体验差，无法感知进度

**流式输出的优势：**
- 用户可以实时看到生成内容
- 降低首字节响应时间（TTFB）
- 提升用户体验，类似打字机效果
- 按token计费，成本可控

### 1.2 流式输出原理

```
LLM生成流程：
Token1 → Token2 → Token3 → Token4 → ...

传统模式：
[等待所有Token] → 一次性返回

流式模式：
Token1 → 返回 → Token2 → 返回 → Token3 → 返回 → ...
```

## 二、SSE（Server-Sent Events）

### 2.1 SSE简介

SSE是HTML5标准的一部分，专门用于服务器向客户端推送数据。

**核心特点：**
- 单向通信：服务器 → 客户端
- 基于HTTP协议
- 浏览器原生支持
- 自动重连机制
- 轻量级，使用简单

### 2.2 SSE vs WebSocket

| 特性 | SSE | WebSocket |
|------|-----|-----------|
| 通信方向 | 单向（服务器→客户端） | 双向 |
| 协议 | HTTP | WS/WSS |
| 数据格式 | 文本 | 文本/二进制 |
| 重连机制 | 浏览器自动重连 | 需手动实现 |
| 适用场景 | AI对话、实时通知 | 聊天室、游戏 |
| 复杂度 | 简单 | 较复杂 |

### 2.3 SSE消息格式

```
data: 这是消息内容\n\n

event: custom-event\n
data: {"type": "message", "content": "Hello"}\n\n

id: 123\n
event: message\n
data: 带ID的消息\n\n
```

**格式规则：**
- 每条消息以`\n\n`结尾
- `data:` 后面是消息内容
- `event:` 指定事件类型
- `id:` 消息ID，用于断点续传

## 三、前端实现

### 3.1 EventSource API

```javascript
const eventSource = new EventSource('/api/stream');

eventSource.onopen = (event) => {
  console.log('连接已建立');
};

eventSource.onmessage = (event) => {
  console.log('收到消息:', event.data);
};

eventSource.onerror = (event) => {
  console.error('连接错误:', event);
  eventSource.close();
};

eventSource.addEventListener('custom-event', (event) => {
  console.log('自定义事件:', event.data);
});
```

### 3.2 Fetch API + ReadableStream

```javascript
async function streamChat(message) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        
        try {
          const json = JSON.parse(data);
          result += json.content || '';
          console.log('当前内容:', result);
        } catch (e) {
          console.error('解析错误:', e);
        }
      }
    }
  }

  return result;
}
```

### 3.3 封装SSE客户端

```javascript
class SSEClient {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.eventSource = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 3;
  }

  connect() {
    this.eventSource = new EventSource(this.url);

    this.eventSource.onopen = () => {
      this.reconnectAttempts = 0;
      this.options.onOpen?.();
    };

    this.eventSource.onmessage = (event) => {
      this.options.onMessage?.(event.data);
    };

    this.eventSource.onerror = (error) => {
      this.options.onError?.(error);
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
      }
    };
  }

  close() {
    this.eventSource?.close();
    this.eventSource = null;
  }
}
```

### 3.4 React Hook封装

```javascript
import { useState, useCallback, useRef } from 'react';

function useStreamChat() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const sendMessage = useCallback(async (message) => {
    setContent('');
    setIsLoading(true);
    setError(null);
    
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal: abortControllerRef.current.signal
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
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
              setContent(prev => prev + (json.choices?.[0]?.delta?.content || ''));
            } catch (e) {}
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  }, []);

  return { content, isLoading, error, sendMessage, stopGeneration };
}
```

## 四、后端实现

### 4.1 Node.js + Express

```javascript
import express from 'express';
import { OpenAI } from 'openai';

const app = express();
const openai = new OpenAI();

app.get('/api/stream', async (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.flushHeaders();

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: '写一首诗' }],
    stream: true
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
  }

  res.write('data: [DONE]\n\n');
  res.end();
});

app.listen(3000);
```

### 4.2 处理客户端断开

```javascript
app.get('/api/stream', async (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.flushHeaders();

  let isClosed = false;

  req.on('close', () => {
    isClosed = true;
    console.log('客户端断开连接');
  });

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: '写一首诗' }],
    stream: true
  });

  for await (const chunk of stream) {
    if (isClosed) break;

    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
  }

  if (!isClosed) {
    res.write('data: [DONE]\n\n');
    res.end();
  }
});
```

### 4.3 心跳保活

```javascript
app.get('/api/stream', async (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.flushHeaders();

  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30000);

  req.on('close', () => {
    clearInterval(heartbeat);
  });

  // ... 流式输出逻辑
});
```

## 五、Vue3实现示例

### 5.1 组合式API

```vue
<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(msg, index) in messages" :key="index" :class="msg.role">
        {{ msg.content }}
      </div>
      <div v-if="streamingContent" class="assistant streaming">
        {{ streamingContent }}<span class="cursor">|</span>
      </div>
    </div>
    <div class="input-area">
      <input v-model="input" @keyup.enter="sendMessage" :disabled="isLoading" />
      <button @click="sendMessage" :disabled="isLoading">发送</button>
      <button @click="stopGeneration" v-if="isLoading">停止</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const messages = ref([]);
const input = ref('');
const streamingContent = ref('');
const isLoading = ref(false);
const abortController = ref(null);

async function sendMessage() {
  if (!input.value.trim() || isLoading.value) return;

  const userMessage = input.value;
  messages.value.push({ role: 'user', content: userMessage });
  input.value = '';
  isLoading.value = true;
  streamingContent.value = '';

  abortController.value = new AbortController();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
      signal: abortController.value.signal
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
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
            streamingContent.value += json.content || '';
          } catch (e) {}
        }
      }
    }

    messages.value.push({ role: 'assistant', content: streamingContent.value });
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(err);
    }
  } finally {
    streamingContent.value = '';
    isLoading.value = false;
  }
}

function stopGeneration() {
  abortController.value?.abort();
  if (streamingContent.value) {
    messages.value.push({ role: 'assistant', content: streamingContent.value });
  }
  streamingContent.value = '';
  isLoading.value = false;
}
</script>

<style scoped>
.streaming {
  background: #f0f0f0;
}
.cursor {
  animation: blink 1s infinite;
}
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>
```

## 六、错误处理与重试

### 6.1 重连机制

```javascript
class ReconnectingSSE {
  constructor(url, options = {}) {
    this.url = url;
    this.options = {
      maxRetries: 5,
      retryDelay: 1000,
      ...options
    };
    this.retryCount = 0;
    this.eventSource = null;
  }

  connect() {
    this.eventSource = new EventSource(this.url);

    this.eventSource.onopen = () => {
      this.retryCount = 0;
      this.options.onOpen?.();
    };

    this.eventSource.onerror = () => {
      this.eventSource.close();
      
      if (this.retryCount < this.options.maxRetries) {
        this.retryCount++;
        const delay = this.options.retryDelay * Math.pow(2, this.retryCount - 1);
        
        setTimeout(() => this.connect(), delay);
        this.options.onRetry?.(this.retryCount, delay);
      } else {
        this.options.onMaxRetriesReached?.();
      }
    };

    this.eventSource.onmessage = (event) => {
      this.options.onMessage?.(event.data);
    };
  }

  close() {
    this.eventSource?.close();
  }
}
```

### 6.2 超时处理

```javascript
async function streamWithTimeout(url, options = {}, timeout = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}
```

## 七、性能优化

### 7.1 节流渲染

```javascript
import { useRef, useCallback, useEffect, useState } from 'react';

function useThrottledStream() {
  const [displayContent, setDisplayContent] = useState('');
  const bufferRef = useRef('');
  const rafRef = useRef(null);

  const updateDisplay = useCallback(() => {
    if (bufferRef.current !== displayContent) {
      setDisplayContent(bufferRef.current);
    }
    rafRef.current = requestAnimationFrame(updateDisplay);
  }, [displayContent]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(updateDisplay);
    return () => cancelAnimationFrame(rafRef.current);
  }, [updateDisplay]);

  const appendContent = useCallback((content) => {
    bufferRef.current += content;
  }, []);

  return { displayContent, appendContent };
}
```

### 7.2 虚拟滚动

```javascript
import { VirtualList } from 'react-virtual-list';

function ChatMessages({ messages }) {
  return (
    <VirtualList
      items={messages}
      itemHeight={60}
      renderItem={({ item, style }) => (
        <div key={item.id} style={style} className={`message ${item.role}`}>
          {item.content}
        </div>
      )}
    />
  );
}
```

## 八、面试高频问题

### Q1: SSE和WebSocket如何选择？

**答案要点：**
- SSE：单向推送、简单场景、AI对话
- WebSocket：双向通信、实时协作、游戏
- AI对话场景推荐SSE，实现简单、自动重连

### Q2: 如何处理SSE连接断开？

**答案要点：**
1. 监听onerror事件
2. 实现指数退避重连
3. 设置最大重试次数
4. 记录已接收内容，断点续传

### Q3: 流式输出如何实现打字机效果？

**答案要点：**
1. 后端逐token推送
2. 前端实时追加内容
3. 使用CSS动画实现光标闪烁
4. 可选：前端节流控制速度

### Q4: 如何取消正在进行的流式请求？

**答案要点：**
1. 使用AbortController
2. 调用abort()方法
3. 后端监听req.on('close')事件
4. 清理资源，停止LLM调用

### Q5: 流式输出的性能优化有哪些？

**答案要点：**
1. 使用requestAnimationFrame节流渲染
2. 虚拟滚动处理长消息列表
3. 避免频繁的DOM操作
4. 使用DocumentFragment批量更新
5. 懒加载历史消息
