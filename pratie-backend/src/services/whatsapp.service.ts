import { Order } from '../types/index.js';

export interface WhatsAppNotificationResult {
  success: boolean;
  message: string;
  clickToChatUrl: string;
  payload: string;
}

export class WhatsAppNotificationService {
  private static get gatewayUrl(): string {
    return process.env.WHATSAPP_GATEWAY_URL?.trim() || '';
  }
  private static get apiToken(): string {
    return process.env.WHATSAPP_API_TOKEN?.trim() || '';
  }
  private static get groupId(): string {
    return process.env.WHATSAPP_GROUP_ID?.trim() || '';
  }
  private static get adminPhone(): string {
    return process.env.WHATSAPP_ADMIN_PHONE?.trim() || '919876543210';
  }
  private static get storefrontBaseUrl(): string {
    return process.env.STOREFRONT_URL?.trim() || 'http://localhost:3000';
  }

  /**
   * Formats a professional luxury order receipt for WhatsApp group delivery.
   */
  static formatOrderMessage(order: Order): string {
    const customerName = order.shippingAddress?.fullName || 'Valued Patron';
    const customerPhone = order.shippingAddress?.phone || order.guestPhone || 'Not Provided';
    const customerEmail = order.guestEmail || 'Not Provided';

    const addressLines = [
      order.shippingAddress?.streetLine1,
      order.shippingAddress?.streetLine2,
      `${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.postalCode || ''}`,
      order.shippingAddress?.country || 'India'
    ].filter(Boolean).join('\n• ');

    const itemsFormatted = order.items.map((it, idx) => {
      const itemLink = `${this.storefrontBaseUrl}/products/${it.productId}`;
      const imgLink = it.imageUrl ? (it.imageUrl.startsWith('http') ? it.imageUrl : `${this.storefrontBaseUrl}${it.imageUrl}`) : '';
      return (
        `*${idx + 1}. ${it.productTitle}*\n` +
        `   • Size: ${it.size || 'Free Size'}\n` +
        `   • Quantity: ${it.quantity} Pc\n` +
        (it.colorName ? `   • Color: ${it.colorName}\n` : '') +
        (imgLink ? `   • Image: ${imgLink}\n` : '') +
        `   • Link: ${itemLink}`
      );
    }).join('\n\n');

    const formattedDate = new Date(order.createdAt).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const cleanCustomerPhone = customerPhone.replace(/\D/g, '');

    return (
`🛎️ *NEW ATELIER ORDER RESERVED — PRATIÈ* 🛎️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 *Order ID:* #${order.orderNumber || order.id}
📅 *Time:* ${formattedDate}

👤 *PATRON DETAILS:*
• *Name:* ${customerName}
• *Phone:* ${customerPhone}
• *Email:* ${customerEmail}
• *Quick Chat:* https://wa.me/${cleanCustomerPhone}

📍 *DELIVERY ADDRESS:*
• ${addressLines}

👗 *CURATED ATTIRE SELECTION:*
${itemsFormatted}

📋 *ORDER STATUS & PRICING:*
• *Pricing:* Atelier Rate on Request (Backend Quoted)
• *Status:* ⏳ Pending Admin Verification & Quote
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 *Action Required:* Please contact the customer on WhatsApp (+${cleanCustomerPhone}) to confirm sizing, provide final quotation, and dispatch courier!`
    );
  }

  /**
   * Generates a Click-to-Chat URL pre-filled with the order text.
   */
  static getClickToChatUrl(text: string, targetPhone?: string): string {
    const phone = targetPhone || this.adminPhone;
    const cleanPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  }

  /**
   * Sends the notification to the WhatsApp group or admin number.
   * If credentials are not yet configured, cleanly logs and returns the shareable payload.
   */
  static async sendOrderNotification(order: Order): Promise<WhatsAppNotificationResult> {
    const messageText = this.formatOrderMessage(order);
    const clickToChatUrl = this.getClickToChatUrl(messageText);

    // If gateway credentials and group ID are configured, perform HTTP dispatch
    if (this.gatewayUrl && this.apiToken && (this.groupId || this.adminPhone)) {
      try {
        const targetChatId = this.groupId ? `${this.groupId}@g.us` : `${this.adminPhone}@c.us`;
        const endpoint = `${this.gatewayUrl}/messages/chat`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiToken}`
          },
          body: JSON.stringify({
            token: this.apiToken,
            to: targetChatId,
            body: messageText
          })
        });

        if (!response.ok) {
          console.warn(`[WhatsApp Service] Gateway returned status ${response.status}`);
          return {
            success: false,
            message: `Gateway responded with status ${response.status}`,
            clickToChatUrl,
            payload: messageText
          };
        }

        console.log(`[WhatsApp Service] Successfully dispatched order #${order.orderNumber} to WhatsApp Group: ${targetChatId}`);
        return {
          success: true,
          message: 'Order notification delivered to WhatsApp Group',
          clickToChatUrl,
          payload: messageText
        };
      } catch (err: any) {
        console.error('[WhatsApp Service] Error dispatching to gateway:', err?.message || err);
        return {
          success: false,
          message: err?.message || 'Gateway connection error',
          clickToChatUrl,
          payload: messageText
        };
      }
    }

    // Default development/pending configuration mode:
    // Log the message cleanly to the terminal so the team can inspect the payload
    console.log('\n============================================================');
    console.log('📱 [WHATSAPP ORDER NOTIFICATION — PENDING GROUP CREDENTIALS]');
    console.log('============================================================');
    console.log(messageText);
    console.log('============================================================');
    console.log(`🔗 Click-to-Chat Test URL: ${clickToChatUrl}\n`);

    return {
      success: true,
      message: 'Order logged (ready for live group credentials)',
      clickToChatUrl,
      payload: messageText
    };
  }
}
