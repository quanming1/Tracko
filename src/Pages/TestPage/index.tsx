import React, { useCallback, useEffect, useRef, useState } from "react";
import { VirtualList } from "../../components/virtual-list/virtual-list";
import styles from "./index.module.scss";
import { useIsAtBottom } from "../../components/virtual-list/helper";

// 消息类型枚举
enum MessageType {
  TEXT = "text",
  SYSTEM = "system",
}

// 消息接口定义
interface Message {
  id: string;
  content: string;
  type: MessageType;
  sender: string;
  timestamp: number;
}

// 系统消息组件
const SystemMessage: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className={styles.systemMessage}>
      <div className={styles.systemContent}>{content}</div>
    </div>
  );
};
function sleepSync(ms: number) {
  const end = Date.now() + ms;
  while (Date.now() < end);
}

// 文本消息组件
const TextMessage: React.FC<{ message: Message; isSelf: boolean }> = ({ message, isSelf }) => {
  sleepSync(100);
  return (
    <div className={`${styles.messageItem} ${isSelf ? styles.selfMessage : styles.otherMessage}`}>
      <div className={styles.avatar}>{message.sender.charAt(0).toUpperCase()}</div>
      <div className={styles.messageContent}>
        <div className={styles.sender}>{message.sender}</div>
        <div className={styles.bubble}>
          <p>{message.content}</p>
          <span className={styles.timestamp}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

function randNum(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成随机内容
const fakeContent = () => {
  const answers = [
    "虚拟列表是一种优化长列表性能的技术，它通过只渲染可视区域内的元素来提高性能。",
    "通过监听滚动事件和计算元素位置，虚拟列表可以动态地更新需要显示的内容。",
    "缓冲区的设置可以让滚动体验更加流畅，防止快速滚动时出现白屏。",
    "每个列表项的高度可以是动态的，虚拟列表会自动处理不同高度的情况。",
    "React中实现虚拟列表需要考虑组件的重渲染优化，可以使用memo来减少不必要的渲染。",
    "虚拟列表的核心是维护一个位置信息的缓存，用于快速定位和计算需要渲染的元素。",
    "在处理大量数据时，虚拟列表可以显著提升页面的响应速度和交互体验。",
    "滚动位置的同步和保持是虚拟列表实现中的一个重要考虑点。",
  ];

  // 随机生成10-60句回答
  const count = randNum(10, 60);
  const selectedAnswers = Array(count)
    .fill(null)
    .map(() => answers[Math.floor(Math.random() * answers.length)]);

  return selectedAnswers.join("\n");
};

// 修改 generateRandomMessage 函数
const generateRandomMessage = (index: number): Message => {
  const types = [MessageType.TEXT, MessageType.SYSTEM];
  const type = types[Math.floor(Math.random() * (index % 10 === 0 ? 2 : 1))];
  const senders = ["用户", "小明", "小红", "系统"];
  const sender = type === MessageType.SYSTEM ? senders[3] : senders[Math.floor(Math.random() * 3)];

  let content = "";
  if (type === MessageType.TEXT) {
    content = sender === "用户" ? "test" : fakeContent();
  } else if (type === MessageType.SYSTEM) {
    const systemMessages = [
      "系统消息：有新用户加入聊天",
      "系统消息：请注意文明用语",
      "系统消息：当前在线人数 128",
      "系统消息：服务器将于今晚12点进行维护",
    ];
    content = systemMessages[Math.floor(Math.random() * systemMessages.length)];
  }

  return {
    id: `msg-${index}-${Date.now()}`,
    content,
    type,
    sender,
    timestamp: Date.now() - Math.floor(Math.random() * 3600000),
  };
};

// 生成初始消息列表
const generateInitialMessages = (count: number): Message[] => {
  return Array(count)
    .fill(null)
    .map((_, index) => generateRandomMessage(index));
};

export default function TestPage(): React.ReactElement {
  const [messages, setMessages] = useState<Message[]>(() => generateInitialMessages(150));
  const [loading, setLoading] = useState(false);

  // 1. 创建一个HTML元素的引用（给containerRef属性使用）
  const containerRef = useRef<HTMLDivElement>(null);

  // 2. 维持一个对VirtualList组件的引用（用于调用scrollToBottom等方法）
  const virtualListRef = useRef<VirtualList<Message>>(null);

  const isAtBottom = useIsAtBottom(10);

  // 渲染消息
  const renderMessage = useCallback((message: Message, index: number) => {
    if (message.type === MessageType.SYSTEM) {
      return <SystemMessage content={message.content} />;
    } else {
      return <TextMessage message={message} isSelf={message.sender === "用户"} />;
    }
  }, []);

  // 修改 addNewMessage 函数
  const addNewMessage = useCallback(() => {
    const newMessage: Message = {
      id: `msg-${messages.length}-${Date.now()}`,
      content: "test",
      type: MessageType.TEXT,
      sender: "用户",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
  }, [messages.length]);

  // 加载更多历史消息
  const loadMoreHistory = useCallback(() => {
    setLoading(true);
    // 模拟网络请求延迟
    setTimeout(() => {
      const newMessages = generateInitialMessages(20);
      setMessages((prev) => [...newMessages, ...prev]);
      setLoading(false);
    }, 1000);
  }, []);

  // 清空消息
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // 当新消息添加且用户已经在底部时，滚动到底部
  useEffect(() => {
    if (isAtBottom && virtualListRef.current) {
      virtualListRef.current.scrollToBottom();
    }
  }, [messages.length, isAtBottom]);

  const getMessageKey = useCallback((message: Message) => message.id, []);

  return (
    <div id="test-page" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className={styles.outter}>
        <h1>虚拟列表 - 聊天应用测试</h1>

        <div className={styles.chatContainer}>
          {loading && <div className={styles.loadingIndicator}>正在加载历史消息...</div>}

          <VirtualList
            saveRenderedIndex
            ref={virtualListRef}
            containerRef={containerRef}
            rows={messages}
            renderRow={renderMessage}
            presetHeight={2000}
            bufferSize={5}
            style={{ height: 700, width: "100%" }}
            eachUukey={getMessageKey}
            defaultScrollToBottom={true}
          />
        </div>

        <div className={styles.controlPanel}>
          <button className={styles.testButton} onClick={loadMoreHistory} disabled={loading}>
            加载更多历史消息
          </button>

          <button className={styles.testButton} onClick={addNewMessage}>
            发送文本消息
          </button>

          <button className={`${styles.testButton} ${styles.clearButton}`} onClick={clearMessages}>
            清空消息
          </button>
        </div>
      </div>
    </div>
  );
}
