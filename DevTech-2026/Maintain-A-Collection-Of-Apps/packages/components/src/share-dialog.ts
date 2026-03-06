import { LitElement, css, html } from 'lit';
import '@esri/calcite-components/components/calcite-action';
import '@esri/calcite-components/components/calcite-button';
import '@esri/calcite-components/components/calcite-dialog';
import '@esri/calcite-components/main.css';

export class ShareDialog extends LitElement {
  static properties = {
    buttonLabel: { type: String, attribute: 'button-label' },
    dialogTitle: { type: String, attribute: 'dialog-title' },
    copySuccessMessage: { type: String, attribute: 'copy-success-message' },
    copyButtonLabel: { type: String, attribute: 'copy-button-label' },
    shareButtonLabel: { type: String, attribute: 'share-button-label' },
    closeButtonLabel: { type: String, attribute: 'close-button-label' },
    dialogOpen: { state: true },
    shareUrl: { state: true },
    copied: { state: true },
    error: { state: true }
  };

  static styles = css`
    :host {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 30;
      font-family: system-ui, sans-serif;
    }

    input {
      width: 100%;
      box-sizing: border-box;
      font: inherit;
      padding: 0.55rem 0.65rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      margin-bottom: 0.75rem;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .social-actions {
      display: flex;
      gap: 0.5rem;
      margin: 0 0 0.75rem;
      flex-wrap: wrap;
    }

    .status {
      font-size: 0.875rem;
      margin: 0.25rem 0 0.75rem;
      color: #334155;
    }
  `;

  buttonLabel = 'Share map';
  dialogTitle = 'Share this map';
  copySuccessMessage = 'Map URL copied.';
  copyButtonLabel = 'Copy URL';
  shareButtonLabel = 'Share URL';
  closeButtonLabel = 'Close dialog';
  dialogOpen = false;
  shareUrl = '';
  copied = false;
  error = '';

  connectedCallback(): void {
    super.connectedCallback();
    this.shareUrl = window.location.href;
  }

  openDialog(): void {
    this.shareUrl = window.location.href;
    this.copied = false;
    this.error = '';
    this.dialogOpen = true;
  }

  closeDialog(): void {
    this.dialogOpen = false;
  }

  handleCalciteClose(): void {
    this.dialogOpen = false;
  }

  async shareLink(): Promise<void> {
    this.error = '';

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: this.shareUrl
        });
        return;
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          this.error = 'Unable to open native share dialog.';
        }
      }
    }

    await this.copyLink();
  }

  async copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.shareUrl);
      this.copied = true;
      this.error = '';
    } catch {
      this.error = 'Unable to copy link to clipboard.';
    }
  }

  get encodedUrl(): string {
    return encodeURIComponent(this.shareUrl);
  }

  get encodedText(): string {
    return encodeURIComponent(`${document.title} ${this.shareUrl}`);
  }

  openShareUrl(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  shareToFacebook(): void {
    this.openShareUrl(`https://www.facebook.com/sharer/sharer.php?u=${this.encodedUrl}`);
  }

  shareToBluesky(): void {
    this.openShareUrl(`https://bsky.app/intent/compose?text=${this.encodedText}`);
  }

  async shareToInstagram(): Promise<void> {
    await this.copyLink();
    this.openShareUrl('https://www.instagram.com/');
  }

  render() {
    return html`
      <calcite-action
        icon="share"
        text=${this.buttonLabel}
        label=${this.buttonLabel}
        text-enabled
        @click=${this.openDialog}
      ></calcite-action>

      <calcite-dialog
        heading=${this.dialogTitle}
        width="m"
        .open=${this.dialogOpen}
        @calciteDialogClose=${this.handleCalciteClose}
      >
        <input readonly .value=${this.shareUrl} @focus=${this.handleInputFocus} />

        ${this.error ? html`<p class="status">${this.error}</p>` : null}
        ${this.copied ? html`<p class="status">${this.copySuccessMessage}</p>` : null}

        <div class="social-actions">
          <calcite-button appearance="outline" @click=${this.copyLink}>${this.copyButtonLabel}</calcite-button>
          <calcite-button appearance="outline" @click=${this.shareToFacebook}>Facebook</calcite-button>
          <calcite-button appearance="outline" @click=${this.shareToBluesky}>Bluesky</calcite-button>
          <calcite-button appearance="outline" @click=${this.shareToInstagram}>Instagram</calcite-button>
        </div>

        <div class="actions" slot="footer-end">
          <calcite-button appearance="solid" @click=${this.shareLink}>${this.shareButtonLabel}</calcite-button>
          <calcite-button appearance="outline" @click=${this.closeDialog}>${this.closeButtonLabel}</calcite-button>
        </div>
      </calcite-dialog>
    `;
  }

  private handleInputFocus(event: FocusEvent): void {
    const target = event.target;

    if (target instanceof HTMLInputElement) {
      target.select();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'share-dialog': ShareDialog;
  }
}

if (!customElements.get('share-dialog')) {
  customElements.define('share-dialog', ShareDialog);
}