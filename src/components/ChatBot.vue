<template>
  <div class="chatbot-container">
    <!-- Botón flotante para abrir chat -->
    <button v-if="!isOpen" class="chat-toggle-btn" @click="toggleChat" :title="t('chatAbrir')" :aria-label="t('chatAbrir')">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 12a8.5 8.5 0 0 1-12.4 7.6L3 21l1.4-5.6A8.5 8.5 0 1 1 21 12z"></path>
        <path d="M8.5 12h.01M12 12h.01M15.5 12h.01"></path>
      </svg>
    </button>

    <!-- Panel del chat -->
    <div v-if="isOpen" class="chat-panel" role="dialog" :aria-label="t('chatTitulo')">
      <div class="chat-header">
        <div class="header-content">
          <img src="../assets/salvador.webp" alt="Salvador" class="salvador-avatar-header" width="44" height="44" />
          <div class="header-text">
            <h3>{{ t('chatTitulo') }}</h3>
            <p class="status"><span class="status-dot"></span>{{ t('chatDisponible') }}</p>
          </div>
        </div>
        <button type="button" class="close-chat-btn" aria-label="Cerrar chat" @click="toggleChat">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="chat-messages">
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
          <div class="message-content">{{ msg.content }}</div>
        </div>
        <div v-if="isLoading" class="message assistant">
          <div class="message-content typing">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <div class="chat-input-section">
        <input
          v-model="userInput"
          type="text"
          class="chat-input"
          :placeholder="t('chatPlaceholder')"
          @keyup.enter="sendMessage"
          :disabled="isLoading"
        />
        <button type="button" class="send-btn" aria-label="Enviar" @click="sendMessage" :disabled="isLoading || !userInput.trim()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { useReactiveLanguage } from '../utils/useLanguage';

const { t } = useReactiveLanguage();

const emit = defineEmits(['toggle']);

const isOpen = ref(false);
const isLoading = ref(false);
const userInput = ref('');
const messages = ref([
  {
    role: 'assistant',
    content: '' // Se inicializa en onMounted
  }
]);

// Inicializar mensaje de bienvenida
onMounted(() => {
  messages.value[0].content = t('chatBienvenida');
});

// Las instrucciones de Salvador (system prompt) y la clave de la API viven ahora en el
// servidor (api/chat.js). Así ya no quedan expuestas en el código del navegador.
const MAX_HISTORY = 10;

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  emit('toggle', isOpen.value);
  if (isOpen.value) {
    nextTick(() => {
      const messagesDiv = document.querySelector('.chat-messages');
      if (messagesDiv) {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
    });
  }
};

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;

  const userMessage = userInput.value;
  userInput.value = '';

  // Agregar mensaje del usuario
  messages.value.push({
    role: 'user',
    content: userMessage
  });

  isLoading.value = true;

  try {
    const history = messages.value
      .filter((m) => m.content)
      .slice(-MAX_HISTORY)
      .map(({ role, content }) => ({ role, content }));

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    });

    // 503 = el servidor no tiene la clave configurada
    if (response.status === 503) {
      messages.value.push({ role: 'assistant', content: t('chatErrorApi') });
      return;
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    messages.value.push({
      role: 'assistant',
      content: data.reply
    });
  } catch (error) {
    console.error('Error al conectar con la API:', error);
    messages.value.push({
      role: 'assistant',
      content: t('chatErrorServidor')
    });
  } finally {
    isLoading.value = false;
    nextTick(() => {
      const messagesDiv = document.querySelector('.chat-messages');
      if (messagesDiv) {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
    });
  }
};
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 998;
}

.chat-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border: 0;
  border-radius: 20px;
  background: var(--grad-brand);
  color: #fff;
  box-shadow: 0 12px 26px -8px rgba(91, 76, 255, 0.75);
  cursor: pointer;
  transition: transform 0.2s ease, border-radius 0.2s ease;
}

.chat-toggle-btn:hover {
  transform: translateY(-2px);
  border-radius: 50%;
}

.chat-panel {
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  width: 380px;
  height: 600px;
  max-height: calc(100svh - 40px);
  overflow: hidden;
  border-radius: var(--r-xl);
  background: var(--surface);
  box-shadow: var(--shadow-lg);
  animation: chat-in 0.28s cubic-bezier(0.2, 0.9, 0.3, 1.1);
}

@keyframes chat-in {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 14px 14px 16px;
  background: var(--grad-brand);
  color: #fff;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.salvador-avatar-header {
  width: 44px;
  height: 44px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  object-fit: cover;
}

.header-text h3 {
  color: #fff;
  font-size: 15px;
  font-weight: 800;
}

.header-text .status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.3);
}

.close-chat-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.close-chat-btn:hover {
  background: rgba(255, 255, 255, 0.28);
}

.chat-messages {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  overflow-y: auto;
  background: var(--surface-2);
}

.message {
  display: flex;
  animation: msg-in 0.25s ease;
}

@keyframes msg-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
}

.message-content {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.45;
  word-wrap: break-word;
  white-space: pre-line;
}

.message.user .message-content {
  border-bottom-right-radius: 6px;
  background: var(--brand);
  color: #fff;
  font-weight: 600;
}

.message.assistant .message-content {
  border-bottom-left-radius: 6px;
  background: var(--surface);
  color: var(--ink);
  box-shadow: var(--shadow-sm);
}

.typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 14px 16px !important;
}

.typing span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--brand);
  animation: typing 1.4s infinite;
}

.typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    opacity: 0.4;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-5px);
  }
}

.chat-input-section {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid var(--line);
  background: var(--surface);
}

.chat-input {
  flex: 1;
  min-width: 0;
  height: 44px;
  padding: 0 16px;
  border: 2px solid var(--line);
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--ink);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.chat-input:focus {
  border-color: var(--brand);
  background: var(--surface);
}

.chat-input::placeholder {
  color: var(--ink-3);
}

.chat-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-btn {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--grad-brand);
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.06);
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ========== Móvil: hoja inferior ========== */
@media (max-width: 480px) {
  .chatbot-container {
    right: 12px;
    bottom: 12px;
  }

  .chat-toggle-btn {
    width: 50px;
    height: 50px;
    border-radius: 18px;
  }

  .chat-panel {
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 85svh;
    max-height: none;
    border-radius: var(--r-xl) var(--r-xl) 0 0;
  }

  .chat-input {
    font-size: 16px;
  }
}
</style>
