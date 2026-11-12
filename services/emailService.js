/**
 * services/emailService.js
 * Celestial Email Notification & Invoice Dispatch Engine
 * 
 * Features:
 * - Nodemailer Ethereal Sandbox (zero-config, web preview links)
 * - Automatic HTML email archiving to data/email_receipts/receipt-ORD-2026-XXXX.html
 * - Full Dark-Mode responsive HTML celestial invoice
 * - Offline-safe fallback ensuring order flow never breaks
 */

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const RECEIPTS_DIR = path.join(__dirname, '..', 'data', 'email_receipts');
if (!fs.existsSync(RECEIPTS_DIR)) {
    fs.mkdirSync(RECEIPTS_DIR, { recursive: true });
}

let transporterPromise = null;

async function getTransporter() {
    if (transporterPromise) return transporterPromise;

    transporterPromise = (async () => {
        // 1. If explicit SMTP credentials are provided in .env
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            console.log(`[EmailService] Using configured SMTP relay: ${process.env.SMTP_HOST}`);
            return nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT || 587),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
        }

        // 2. Default to Nodemailer Ethereal Sandbox (generates real web preview link)
        try {
            console.log('[EmailService] Provisioning Ethereal test account for order confirmation email...');
            const testAccount = await nodemailer.createTestAccount();
            console.log(`[EmailService] Ethereal account ready: ${testAccount.user}`);
            
            return nodemailer.createTransport({
                host: testAccount.smtp.host,
                port: testAccount.smtp.port,
                secure: testAccount.smtp.secure,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
        } catch (err) {
            console.warn(`[EmailService] Ethereal test account unavailable (${err.message}). Local fallback will archive HTML receipts.`);
            return null;
        }
    })();

    return transporterPromise;
}

/**
 * Generates dark-mode minimalist HTML email invoice
 */
function generateCelestialEmailHtml(order) {
    const formattedDate = new Date(order.createdAt || Date.now()).toUTCString();
    const deliveryDate = new Date(order.estimatedDelivery || (Date.now() + 4 * 86400000)).toDateString();
    const items = order.items || [];
    const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
    const shipping = order.shippingFee !== undefined ? Number(order.shippingFee) : 0;
    const grandTotal = (subtotal + shipping).toFixed(2);

    const itemsHtml = items.map(item => `
        <tr style="border-bottom: 1px solid #1a1a1a;">
            <td style="padding: 14px 10px; color: #ffffff; font-size: 14px; font-weight: 600;">
                <div>${item.title}</div>
                <div style="font-size: 11px; color: #666666; margin-top: 3px;">
                    SKU: ${(item.productId || 'SPACE-GEAR').toUpperCase()}
                </div>
            </td>
            <td style="padding: 14px 10px; text-align: center; color: #cccccc; font-size: 13px;">
                <span style="background: #141414; border: 1px solid #2a2a2a; padding: 3px 8px; border-radius: 4px;">
                    ${item.size || 'M'}
                </span>
            </td>
            <td style="padding: 14px 10px; text-align: center; color: #ffffff; font-size: 14px;">
                ${item.quantity}
            </td>
            <td style="padding: 14px 10px; text-align: right; color: #888888; font-size: 14px;">
                $${Number(item.price).toFixed(2)}
            </td>
            <td style="padding: 14px 10px; text-align: right; color: #ffffff; font-size: 14px; font-weight: 700;">
                $${(Number(item.price) * Number(item.quantity)).toFixed(2)}
            </td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solar Explorer Order Confirmation - ${order.orderId}</title>
</head>
<body style="margin: 0; padding: 24px 0; background-color: #000000; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <center>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #1f1f1f; border-radius: 8px; overflow: hidden;">
            
            <!-- HEADER -->
            <tr>
                <td style="padding: 32px 30px 24px 30px; text-align: center; border-bottom: 1px solid #1a1a1a;">
                    <div style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #888888; font-weight: 700; margin-bottom: 8px;">
                        SOLAR EXPLORER OFFICIAL STORE
                    </div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: 1px;">
                        ORDER CONFIRMED
                    </h1>
                    <p style="margin: 6px 0 0 0; font-size: 14px; color: #888888;">
                        Thank you for your order, ${order.customer.name}.
                    </p>
                </td>
            </tr>

            <!-- ORDER IDENTIFIER & DATE -->
            <tr>
                <td style="padding: 20px 30px; background-color: #060606; border-bottom: 1px solid #1a1a1a;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="50%" style="vertical-align: top;">
                                <div style="font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">ORDER NUMBER</div>
                                <div style="font-size: 16px; color: #ffffff; font-weight: 700; margin-top: 4px; font-family: monospace;">
                                    ${order.orderId}
                                </div>
                                <div style="font-size: 12px; color: #888888; margin-top: 4px;">
                                    ${formattedDate}
                                </div>
                            </td>
                            <td width="50%" style="vertical-align: top; text-align: right;">
                                <div style="font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">PAYMENT STATUS</div>
                                <div style="font-size: 13px; color: #22c55e; font-weight: 600; margin-top: 4px;">
                                    ✓ PAID IN FULL ($${grandTotal})
                                </div>
                                <div style="font-size: 11px; color: #666666; margin-top: 2px;">
                                    Instant Pay Simulation
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- SHIPPING DESTINATION -->
            <tr>
                <td style="padding: 20px 30px; border-bottom: 1px solid #1a1a1a;">
                    <div style="font-size: 11px; color: #666666; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                        DELIVERY ADDRESS
                    </div>
                    <div style="color: #ffffff; font-size: 14px; font-weight: 600;">${order.customer.name}</div>
                    <div style="color: #999999; font-size: 13px; margin-top: 2px;">${order.customer.address}</div>
                    <div style="color: #999999; font-size: 13px;">${order.customer.city}, ${order.customer.state || ''} ${order.customer.zip}</div>
                    <div style="color: #666666; font-size: 12px; margin-top: 4px;">Contact: ${order.customer.email}</div>
                </td>
            </tr>

            <!-- ITEMS TABLE -->
            <tr>
                <td style="padding: 24px 30px;">
                    <div style="font-size: 11px; color: #666666; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                        PURCHASED MERCHANDISE
                    </div>
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <thead>
                            <tr style="border-bottom: 1px solid #222222;">
                                <th style="padding: 8px 10px; text-align: left; font-size: 11px; color: #666666; text-transform: uppercase;">Item</th>
                                <th style="padding: 8px 10px; text-align: center; font-size: 11px; color: #666666; text-transform: uppercase;">Size</th>
                                <th style="padding: 8px 10px; text-align: center; font-size: 11px; color: #666666; text-transform: uppercase;">Qty</th>
                                <th style="padding: 8px 10px; text-align: right; font-size: 11px; color: #666666; text-transform: uppercase;">Price</th>
                                <th style="padding: 8px 10px; text-align: right; font-size: 11px; color: #666666; text-transform: uppercase;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>

                    <!-- FINANCIAL TOTALS -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
                        <tr>
                            <td width="55%"></td>
                            <td width="45%">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding: 4px 0; color: #888888; font-size: 13px;">Subtotal:</td>
                                        <td style="padding: 4px 0; text-align: right; color: #ffffff; font-size: 13px;">$${subtotal.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 4px 0; color: #888888; font-size: 13px;">Shipping:</td>
                                        <td style="padding: 4px 0; text-align: right; color: #22c55e; font-size: 13px;">FREE</td>
                                    </tr>
                                    <tr style="border-top: 1px solid #222222;">
                                        <td style="padding: 10px 0 0 0; color: #ffffff; font-size: 14px; font-weight: 700; text-transform: uppercase;">Total Paid:</td>
                                        <td style="padding: 10px 0 0 0; text-align: right; color: #ffffff; font-size: 18px; font-weight: 700; font-family: monospace;">$${grandTotal}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- TRACKING INFO -->
            <tr>
                <td style="padding: 20px 30px; background-color: #060606; border-top: 1px solid #1a1a1a;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td>
                                <div style="font-size: 11px; color: #666666; text-transform: uppercase;">TRACKING REFERENCE</div>
                                <div style="font-size: 14px; color: #ffffff; font-weight: bold; font-family: monospace; margin-top: 2px;">
                                    ${order.trackingNumber || 'TRK-SOLAR-ORBIT'}
                                </div>
                                <div style="font-size: 12px; color: #888888; margin-top: 4px;">
                                    Estimated Delivery: <strong>${deliveryDate}</strong>
                                </div>
                            </td>
                            <td style="text-align: right;">
                                <span style="display: inline-block; padding: 4px 10px; background: #141414; border: 1px solid #2a2a2a; color: #ffffff; border-radius: 4px; font-size: 11px; font-weight: 600;">
                                    CONFIRMED
                                </span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- FOOTER -->
            <tr>
                <td style="padding: 24px 30px; text-align: center; font-size: 11px; color: #555555; border-top: 1px solid #1a1a1a;">
                    <p style="margin: 0 0 4px 0;">Solar Explorer Store • All orders simulated for A3 academic project evaluation.</p>
                    <p style="margin: 0;">Order Reference: ${order.orderId}</p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
    `;
}

async function sendOrderConfirmation(order) {
    const htmlContent = generateCelestialEmailHtml(order);

    // 1. Save HTML receipt file locally in data/email_receipts/
    const safeOrderId = String(order.orderId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const receiptFileName = `receipt-${safeOrderId}.html`;
    const receiptFilePath = path.join(RECEIPTS_DIR, receiptFileName);

    try {
        fs.writeFileSync(receiptFilePath, htmlContent, 'utf8');
        console.log(`[EmailService] Local HTML invoice archived at: ${receiptFilePath}`);
    } catch (fsErr) {
        console.error('[EmailService] Failed to write local receipt file:', fsErr);
    }

    // 2. Dispatch via Nodemailer
    try {
        const transporter = await getTransporter();

        if (!transporter) {
            return {
                success: true,
                orderId: order.orderId,
                messageId: `LOCAL-${Date.now()}`,
                previewUrl: null,
                receiptPath: path.join('data', 'email_receipts', receiptFileName),
                mode: 'local_file_archived'
            };
        }

        const mailOptions = {
            from: '"Solar Explorer Store" <orders@solarexplorer.org>',
            to: `"${order.customer.name}" <${order.customer.email}>`,
            subject: `🪐 Order Confirmed: ${order.orderId} - Solar Explorer Space Merchandise`,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        const previewUrl = nodemailer.getTestMessageUrl(info) || null;

        console.log(`[EmailService] Order email sent to: ${order.customer.email} (MessageID: ${info.messageId})`);
        if (previewUrl) {
            console.log(`[EmailService] 🔗 ETHEREAL EMAIL PREVIEW URL: ${previewUrl}`);
        }

        return {
            success: true,
            orderId: order.orderId,
            messageId: info.messageId,
            previewUrl: previewUrl,
            receiptPath: path.join('data', 'email_receipts', receiptFileName),
            mode: previewUrl ? 'ethereal_sandbox' : 'smtp_relay'
        };
    } catch (err) {
        console.warn(`[EmailService] Nodemailer dispatch error: ${err.message}. Local receipt file preserved.`);
        return {
            success: true,
            orderId: order.orderId,
            messageId: `FALLBACK-${Date.now()}`,
            previewUrl: null,
            receiptPath: path.join('data', 'email_receipts', receiptFileName),
            mode: 'local_file_archived',
            warning: err.message
        };
    }
}

module.exports = {
    sendOrderConfirmation,
    generateCelestialEmailHtml,
    RECEIPTS_DIR
};
