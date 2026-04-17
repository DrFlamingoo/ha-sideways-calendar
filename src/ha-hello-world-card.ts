import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

interface CardConfig {
  type: string;
  message?: string;
}

@customElement("ha-hello-world-card")
export class HaHelloWorldCard extends LitElement {
  @property({ attribute: false }) config!: CardConfig;

  setConfig(config: CardConfig) {
    this.config = config;
  }

  getCardSize() {
    return 1;
  }

  getGridOptions() {
    return { rows: 1, columns: 6, min_rows: 1 };
  }

  static getStubConfig() {
    return { message: "Hello World" };
  }

  static getConfigForm() {
    return {
      schema: [{ name: "message", selector: { text: {} } }],
    };
  }

  render() {
    const message = this.config?.message || "Hello World";
    return html`
      <ha-card>
        <div class="card-content">${message}</div>
      </ha-card>
    `;
  }

  static styles = css`
    .card-content {
      padding: 16px;
    }
  `;
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "ha-hello-world-card",
  name: "Hello World Card",
  description: "A minimal card that displays a configurable string.",
});

declare global {
  interface Window {
    customCards: Array<{ type: string; name: string; description?: string }>;
  }
}
