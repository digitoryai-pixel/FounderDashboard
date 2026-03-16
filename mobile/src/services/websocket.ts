import { WS_URL } from '../constants/api';

type MessageHandler = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private handlers: Set<MessageHandler> = new Set();
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private isConnected = false;

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('WebSocket connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handlers.forEach((handler) => handler(data));
        } catch {
          // ignore parse errors
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = setTimeout(() => this.connect(), 5000);
  }

  subscribe(handler: MessageHandler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  disconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.ws?.close();
    this.ws = null;
    this.isConnected = false;
  }
}

export default new WebSocketService();
