/**
 * controllers/orderController.js
 * Controller handling e-commerce checkout, orders, receipts, and merchandise pre-orders.
 * Part of Solar Explorer MVC Architecture.
 */
const path = require('path');
const fs = require('fs');
const StorageService = require('../services/storageService');
const EmailService = require('../services/emailService');

/**
 * Handle new order checkout and email confirmation dispatch
 * POST /api/orders & POST /api/merchandise/checkout
 */
async function handleOrderPlacement(req, res) {
    try {
        const { customer, items, totalAmount, paymentMethod } = req.body;

        if (!customer || typeof customer !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'Customer delivery address and details are required.'
            });
        }

        const { name, email, address, city, state, zip } = customer;
        if (!name || !email || !address || !city) {
            return res.status(400).json({
                success: false,
                error: 'Missing mandatory fields: name, email, street address, and city are required.'
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Cart must contain at least one purchased merchandise item.'
            });
        }

        const computedSubtotal = items.reduce((sum, i) => sum + (Number(i.price) * Number(i.quantity || 1)), 0);
        const finalTotal = totalAmount !== undefined ? Number(totalAmount) : (req.body.total !== undefined ? Number(req.body.total) : computedSubtotal);

        // Persist order in Dual Storage (Mongo + data/orders.json)
        const orderRecord = await StorageService.createOrder({
            customer: {
                name: name.trim(),
                email: email.trim(),
                address: address.trim(),
                city: city.trim(),
                state: (state || 'CA').trim(),
                zip: (zip || '32920').trim()
            },
            items: items.map(i => ({
                productId: i.productId || 'space-merch',
                title: i.title || 'Space Merchandise Item',
                price: Number(i.price || 0),
                size: i.size || 'M',
                quantity: Number(i.quantity || 1),
                image: i.image || 'images/merch/lunar-bomber.png'
            })),
            totalAmount: finalTotal,
            paymentMethod: paymentMethod || 'demo_card',
            username: req.body.username || (customer && customer.username) || null
        });

        // Trigger email confirmation dispatch
        const emailResult = await EmailService.sendOrderConfirmation(orderRecord);

        // Update audit metadata
        await StorageService.updateOrderEmailStatus(orderRecord.orderId, {
            dispatched: emailResult.success,
            messageId: emailResult.messageId,
            previewUrl: emailResult.previewUrl,
            receiptFile: emailResult.receiptPath,
            dispatchedAt: new Date().toISOString(),
            dispatchMode: emailResult.mode
        });

        return res.status(201).json({
            success: true,
            message: 'Order processed successfully! Confirmation email dispatched.',
            orderId: orderRecord.orderId,
            trackingNumber: orderRecord.trackingNumber,
            data: {
                ...orderRecord,
                emailNotification: {
                    dispatched: emailResult.success,
                    previewUrl: emailResult.previewUrl,
                    receiptPath: emailResult.receiptPath,
                    dispatchMode: emailResult.mode
                }
            },
            email: {
                sent: emailResult.success,
                previewUrl: emailResult.previewUrl,
                receiptPath: emailResult.receiptPath,
                viewReceiptUrl: `/api/orders/${orderRecord.orderId}/receipt`
            }
        });
    } catch (err) {
        console.error('[orderController] Error processing order:', err);
        return res.status(500).json({
            success: false,
            error: 'Failed to process checkout transaction',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

/**
 * Retrieve order details by orderId or tracking number
 * GET /api/orders/:id
 */
async function getOrderById(req, res) {
    try {
        const order = await StorageService.getOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: `Order not found for identifier: ${req.params.id}`
            });
        }
        res.json({ success: true, data: order });
    } catch (err) {
        console.error('[orderController] Error querying order:', err);
        res.status(500).json({ success: false, error: 'Error querying order' });
    }
}

/**
 * List all orders with optional email filter
 * GET /api/orders
 */
async function getAllOrders(req, res) {
    try {
        const { email, limit } = req.query;
        const filter = {};
        if (email) filter.email = email;
        const list = await StorageService.getOrders(filter, Number(limit || 50));
        res.json({ success: true, count: list.length, data: list });
    } catch (err) {
        console.error('[orderController] Error fetching orders:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch orders' });
    }
}

/**
 * Direct in-browser view of the rendered HTML email invoice
 * GET /api/orders/:id/receipt
 */
async function getOrderReceipt(req, res) {
    try {
        const order = await StorageService.getOrderById(req.params.id);
        if (!order) {
            return res.status(404).send('Order not found');
        }
        const safeOrderId = String(order.orderId).replace(/[^a-zA-Z0-9_-]/g, '_');
        const receiptPath = path.join(EmailService.RECEIPTS_DIR, `receipt-${safeOrderId}.html`);

        if (fs.existsSync(receiptPath)) {
            return res.sendFile(receiptPath);
        }

        const html = EmailService.generateCelestialEmailHtml(order);
        res.setHeader('Content-Type', 'text/html');
        return res.send(html);
    } catch (err) {
        console.error('[orderController] Error rendering receipt:', err);
        res.status(500).send('Error rendering receipt');
    }
}

/**
 * Update the status of an existing order
 * PATCH /api/orders/:id/status or PUT /api/orders/:id/status
 */
async function updateOrderStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ success: false, error: 'Status is required.' });
        }
        const updated = await StorageService.updateOrderStatus(id, status);
        if (!updated) {
            return res.status(404).json({ success: false, error: `Order not found for identifier: ${id}` });
        }
        res.json({ success: true, message: 'Order status updated successfully.', data: updated });
    } catch (err) {
        console.error('[orderController] Error updating order status:', err);
        res.status(500).json({ success: false, error: 'Failed to update order status' });
    }
}

// ====================================================
// MERCHANDISE PRE-ORDERS (Legacy / VIP Registration)
// ====================================================

/**
 * Retrieve merchandise pre-orders list
 * GET /api/merchandise
 */
async function getMerchandise(req, res) {
    try {
        const { status } = req.query;
        const list = await StorageService.getMerchandise({ status });
        res.json({
            success: true,
            count: list.length,
            data: list
        });
    } catch (err) {
        console.error('[orderController] Error fetching merchandise preorders:', err);
        res.status(500).json({ success: false, error: 'Failed to retrieve merchandise orders' });
    }
}

/**
 * Retrieve merchandise allocation stats
 * GET /api/merchandise/stats
 */
async function getMerchandiseStats(req, res) {
    try {
        const orders = await StorageService.getMerchandise();
        const maxCapacity = 500;
        const confirmed = orders.length;
        const remaining = Math.max(0, maxCapacity - confirmed);
        const percentClaimed = ((confirmed / maxCapacity) * 100).toFixed(1);

        res.json({
            success: true,
            data: {
                totalAllocated: confirmed,
                remainingCapacity: remaining,
                percentClaimed: Number(percentClaimed),
                vipDiscount: '20% OFF Early Bird',
                batchStatus: remaining > 0 ? 'Open For Registration' : 'Batch Finalized'
            }
        });
    } catch (err) {
        console.error('[orderController] Error computing merchandise stats:', err);
        res.status(500).json({ success: false, error: 'Failed to compute merchandise stats' });
    }
}

/**
 * Lookup pre-order by VIP Pass ID or internal ID
 * GET /api/merchandise/:id
 */
async function getMerchandiseById(req, res) {
    try {
        const order = await StorageService.getMerchandiseById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: `No pre-order found for ticket/ID: ${req.params.id}`
            });
        }
        res.json({ success: true, data: order });
    } catch (err) {
        console.error('[orderController] Error querying merchandise order:', err);
        res.status(500).json({ success: false, error: 'Error querying merchandise order' });
    }
}

/**
 * Place new VIP pre-order
 * POST /api/merchandise
 */
async function createMerchandise(req, res) {
    try {
        const { name, email, product, size, quantity, suggestions, wishlist } = req.body;
        if (!name || !email || !product) {
            return res.status(400).json({
                success: false,
                error: 'Required fields missing: name, email, and product are mandatory.'
            });
        }

        const newOrder = await StorageService.createMerchandise({
            name: name.trim(),
            email: email.trim(),
            product: product.trim(),
            size: size || 'Medium',
            quantity: Number(quantity) || 1,
            suggestions: suggestions || wishlist || 'None provided'
        });

        res.status(201).json({
            success: true,
            message: 'VIP Pre-order registered successfully!',
            vipPassId: newOrder.vipPassId,
            data: newOrder
        });
    } catch (err) {
        console.error('[orderController] Error creating merchandise pre-order:', err);
        res.status(500).json({ success: false, error: 'Failed to persist merchandise pre-order' });
    }
}

/**
 * Cancel VIP pre-order
 * DELETE /api/merchandise/:id
 */
async function deleteMerchandise(req, res) {
    try {
        const removed = await StorageService.deleteMerchandise(req.params.id);
        if (!removed) {
            return res.status(404).json({ success: false, error: 'Merchandise pre-order not found.' });
        }
        res.json({
            success: true,
            message: 'Pre-order registration cancelled.',
            data: removed
        });
    } catch (err) {
        console.error('[orderController] Error deleting merchandise pre-order:', err);
        res.status(500).json({ success: false, error: 'Failed to cancel merchandise order' });
    }
}

module.exports = {
    handleOrderPlacement,
    createOrder: handleOrderPlacement,
    getOrderById,
    getAllOrders,
    getOrders: getAllOrders,
    getOrderReceipt,
    updateOrderStatus,
    getMerchandise,
    getMerchandiseStats,
    getMerchandiseById,
    createMerchandise,
    deleteMerchandise
};
