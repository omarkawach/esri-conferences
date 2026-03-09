import { LitElement, css, html } from 'lit';
import '@esri/calcite-components/components/calcite-action';
import '@esri/calcite-components/components/calcite-button';
import '@esri/calcite-components/components/calcite-input-text';
import '@esri/calcite-components/components/calcite-popover';
import '@esri/calcite-components/main.css';

export class ShareDialog extends LitElement {
  // configurable labels/messages so host apps can localize text without changing code.
  static properties = {
    buttonLabel: { type: String, attribute: 'button-label' },
    dialogTitle: { type: String, attribute: 'dialog-title' },
    copySuccessMessage: { type: String, attribute: 'copy-success-message' },
    shareUrlLabel: { type: String, attribute: 'share-url-label' },
    copyButtonLabel: { type: String, attribute: 'copy-button-label' },
    shareButtonLabel: { type: String, attribute: 'share-button-label' },
    closeButtonLabel: { type: String, attribute: 'close-button-label' },
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

  buttonLabel = 'Share';
  dialogTitle = 'Share this map';
  copySuccessMessage = 'URL copied.';
  shareUrlLabel = 'Share URL';
  copyButtonLabel = 'Copy URL';
  closeButtonLabel = 'Close dialog';
  shareUrl = '';
  copied = false;
  error = '';

  connectedCallback(): void {
    super.connectedCallback();
    this.shareUrl = window.location.href;
  }

  private get supportsNativeShare(): boolean {
    // Use native share only on mobile where platform sheets are expected UX.
    const isMobileDevice =
      /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints > 1 && window.matchMedia('(pointer: coarse)').matches);

    if (!isMobileDevice) {
      return false;
    }

    const navigatorWithShare = navigator as Navigator & {
      share?: (data?: ShareData) => Promise<void>;
    };

    return typeof navigatorWithShare.share === 'function';
  }

  async handleShareAction(): Promise<void> {
    // Primary button behavior:
    // - Mobile + Web Share API: launch native sheet immediately.
    // - Desktop / unsupported: let popover trigger naturally on click.
    this.shareUrl = window.location.href;

    if (this.supportsNativeShare) {
      await this.shareLink();
    }
  }

  async shareLink(): Promise<void> {
    // Clear prior status before each share attempt to avoid stale success/error messages.
    this.error = '';
    this.copied = false;

    if (this.supportsNativeShare) {
      try {
        await navigator.share({
          title: document.title,
          url: this.shareUrl
        });
        return;
      } catch (error) {
        // Native share cancelled do not copy to clipboard.
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    // If native share is unavailable or failed, copy URL to clipboard.
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
    // Open social share endpoints safely in a new tab.
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  shareToFacebook(): void {
    this.openShareUrl(`https://www.facebook.com/sharer/sharer.php?u=${this.encodedUrl}`);
  }

  shareToBluesky(): void {
    this.openShareUrl(`https://bsky.app/intent/compose?text=${this.encodedText}`);
  }

  shareToLinkedIn(): void {
    this.openShareUrl(`https://www.linkedin.com/sharing/share-offsite/?url=${this.encodedUrl}`);
  }

  private get shareActionElement(): HTMLElement | null {
    return this.renderRoot.querySelector('#share-action');
  }

  private syncPopoverReferenceElement(): void {
    const popover = this.renderRoot.querySelector('calcite-popover') as
      | (HTMLElement & { referenceElement?: Element | null })
      | null;

    if (!popover) {
      return;
    }

    popover.referenceElement = this.shareActionElement;
  }

  protected firstUpdated(): void {
    this.syncPopoverReferenceElement();
  }

  protected updated(): void {
    this.syncPopoverReferenceElement();
  }

  private closePopover(): void {
    const popover = this.renderRoot.querySelector('calcite-popover') as
      | (HTMLElement & { open: boolean })
      | null;

    if (popover) {
      popover.open = false;
    }
  }

  render() {
    return html`
      <calcite-action
        id="share-action"
        icon="share"
        text=${this.buttonLabel}
        label=${this.buttonLabel}
        text-enabled
        @click=${this.handleShareAction}
      ></calcite-action>

      <calcite-popover
        closable
        heading="${this.dialogTitle}"
      >
        <p>
          <!-- Clicking the input copies the URL to clipboard for quick sharing.
            We call the same copyLink() helper used by the Copy button so
            the UI and status behavior remains consistent. -->
          <calcite-input-text
            scale="s"
            read-only
            label=${this.shareUrlLabel}
            .value=${this.shareUrl}
            @click=${this.copyLink}
          ></calcite-input-text>

          ${this.error ? html`<p class="status">${this.error}</p>` : null}
          ${this.copied ? html`<p class="status">${this.copySuccessMessage}</p>` : null}

          <div class="social-actions">
            <calcite-button icon-start="copy-to-clipboard" appearance="outline" @click=${this.copyLink}>${this.copyButtonLabel}</calcite-button>
            <calcite-button appearance="outline" @click=${this.shareToFacebook}>Facebook</calcite-button>
            <calcite-button appearance="outline" @click=${this.shareToBluesky}>Bluesky</calcite-button>
            <calcite-button appearance="outline" @click=${this.shareToLinkedIn}>LinkedIn</calcite-button>
          </div>
      </p>
      </calcite-popover>
    `;
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