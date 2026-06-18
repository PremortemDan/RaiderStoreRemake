<template>
  <div class="chatbot-container">
    <!-- Botón flotante para abrir chat -->
    <button v-if="!isOpen" class="chat-toggle-btn" @click="toggleChat" :title="t('chatAbrir')">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </button>

    <!-- Panel del chat -->
    <div v-if="isOpen" class="chat-panel">
      <div class="chat-header">
        <div class="header-content">
          <img src="../assets/salvador.jpeg" alt="Salvador" class="salvador-avatar-header" />
          <div class="header-text">
            <h3>{{ t('chatTitulo') }}</h3>
            <p class="status">{{ t('chatDisponible') }}</p>
          </div>
        </div>
        <button class="close-chat-btn" @click="toggleChat">✕</button>
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
        <button class="send-btn" @click="sendMessage" :disabled="isLoading || !userInput.trim()">
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

const systemPrompt = `Eres Salvador, el asistente de ayuda, soló para resolver dudas de RaiderStore, una tienda de cosméticos de Fortnite. 
Tu personalidad es la de un mexicano joven y amigable que habla con jerga y modismos mexicanos naturalmente.
Debes ser útil, amable y profesional, pero manteniendo un tono casual y divertido.

Información sobre la tienda:
- Vendemos cosméticos originales de Fortnite (skins, emotes, pickaxes, wraps, etc.)
- Los precios están en V-Bucks convertimos automáticamente a MXN y USD
- los pagos pagos se hacen por WhatsApp
- Los clientes deben agregar nuestras cuentas como amigos en Epic Games
- diles que necesitan añadir de amigos las cuentas RSPAVOS, que pueden usar este link: https://epiclim.cloud/agregar/k8352buX_cNBqCqr3rFd7g
- una ves hecho el pedido, tiene que esperar 48 horas si es la primera vez que añadió las cuentas RSPAVOS.
- si tiene problemas para añadir las cuentas mediante el link, puede añadirlas manualmente con el nombre de usuario RSPAVOS,
RSPAVOS2, RSPAVOS3, RSPAVOS4, RSPAVOS5, RSPAVOS6, RSPAVOS7, RSPAVOS8, RSPAVOS9, RSPAVOS10, RSPAVOS11, RSPAVOS12, cualquiera de esas son validad.
- si ya habias añadido las cuentas RSPAVOS el pedido es mucho mas rapido, puede tardar entre 1-3 horas dependiendo del pedido.
- Si tienes algun problema o duda, mejor contacta por WhatsApp directamente.

Usa expresiones mexicanas.
Sé breve en tus respuestas (máximo 2-3 oraciones) pero siempre útil.
Si no sabes algo, sugiere que contacten por WhatsApp directamente.`;

const toggleChat = () => {
  isOpen.value = !isOpen.value;
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
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    
    if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
      messages.value.push({
        role: 'assistant',
        content: t('chatErrorApi')
      });
      isLoading.value = false;
      return;
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          ...messages.value
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    messages.value.push({
      role: 'assistant',
      content: assistantMessage
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
  bottom: 20px;
  right: 20px;
  z-index: 998;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.chat-toggle-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF8C00 0%, #D35400 100%);
  color: #ffffff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.chat-toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(255, 140, 0, 0.4);
}

.chat-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 380px;
  height: 600px;
  background: linear-gradient(135deg, #4A1800 0%, #E85D04 100%);
  max-height: 600px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.1);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-header {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h3 {
  margin: 0 0 4px 0;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
}

.header-content .status {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.salvador-avatar-header {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #FF8C00;
}

.header-text h3 {
  margin: 0 0 4px 0;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
}

.header-text .status {
  margin: 0;
  color: #90ee90;
  font-size: 12px;
  font-weight: 600;
}

.close-chat-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #ffffff;
  font-size: 20px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-chat-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 12px;
  word-wrap: break-word;
  line-height: 1.4;
  font-size: 14px;
}

.message.user .message-content {
  background: linear-gradient(135deg, #FF8C00 0%, #D35400 100%);
  color: #ffffff;
  font-weight: 600;
}

.message.assistant .message-content {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 14px !important;
}

.typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #FF8C00;
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
    opacity: 0.5;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-8px);
  }
}

.chat-input-section {
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 8px;
}

.chat-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  font-size: 13px;
  outline: none;
  transition: all 0.3s ease;
}

.chat-input:focus {
  border-color: #FF8C00;
  box-shadow: 0 0 8px rgba(255, 140, 0, 0.3);
}

.chat-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.chat-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: linear-gradient(135deg, #FF8C00 0%, #D35400 100%);
  color: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-weight: 700;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 140, 0, 0.4);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ========== RESPONSIVE: Tablet ========== */
@media (max-width: 768px) {
  .chat-panel {
    width: 90%;
    max-height: calc(100vh - 100px);
    height: auto;
    bottom: 80px;
    right: 5%;
    left: 5%;
  }

  .header-content h3 {
    font-size: 15px;
  }

  .message-content {
    max-width: 80%;
    font-size: 13px;
    padding: 8px 12px;
  }

  .chat-input {
    font-size: 12px;
    padding: 8px 10px;
  }

  .send-btn {
    width: 36px;
    height: 36px;
  }
}

/* ========== RESPONSIVE: Móvil ========== */
@media (max-width: 480px) {
  .chatbot-container {
    bottom: 10px;
    right: 10px;
  }

  .chat-toggle-btn {
    width: 50px;
    height: 50px;
  }

  .chat-panel {
    width: 100%;
    max-height: calc(100vh - 60px);
    height: auto;
    bottom: 0;
    right: 0;
    left: 0;
    border-radius: 20px 20px 0 0;
  }

  .chat-header {
    padding: 12px;
    flex-shrink: 0;
  }

  .header-content h3 {
    font-size: 14px;
    margin-bottom: 2px;
  }

  .header-content .status {
    font-size: 11px;
  }

  .close-chat-btn {
    width: 30px;
    height: 30px;
    font-size: 18px;
  }

  .chat-messages {
    padding: 12px;
    gap: 10px;
    flex: 1;
    min-height: 200px;
  }

  .message-content {
    max-width: 85%;
    font-size: 12px;
    padding: 8px 10px;
  }

  .chat-input-section {
    padding: 10px;
    gap: 6px;
    flex-shrink: 0;
  }

  .chat-input {
    font-size: 12px;
    padding: 8px 10px;
  }

  .send-btn {
    width: 36px;
    height: 36px;
  }
}
</style>