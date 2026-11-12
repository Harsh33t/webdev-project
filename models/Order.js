/**
 * models/Order.js
 * Mongoose Schema & Model for Solar Explorer E-Commerce Orders
 * Part of Solar Explorer Full-Stack Architecture
 */

const mongoose = require('mongoose');

// Helper to generate unique celestial Order IDs (e.g., ORD-2026-7492)
function generateOrderId() {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `ORD-2026-${randomSuffix}`;
}

// Helper to generate orbital tracking numbers
function generateTrackingNumber() {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TRK-SOLAR-${code}`;
}

// Subdocument Schema: Individual Merch Line Item
const orderItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: [true, 'Product ID is required'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Item title is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Item unit price is required'],
        min: [0, 'Price cannot be negative']
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L', 'XL', '2XL', 'Small', 'Medium', 'Large', 'One Size', 'N/A'],
        default: 'M'
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
        default: 1
    },
    image: {
        type: String,
        default: 'images/merch/lunar-bomber.png'
    }
}, { _id: false });

// Subdocument Schema: Customer Shipping Profile
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
        maxlength: 120
    },
    email: {
        type: String,
        required: [true, 'Customer email is required'],
        trim: true,
        lowercase: true
    },
    address: {
        type: String,
        required: [true, 'Shipping street address is required'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    state: {
        type: String,
        default: 'CA',
        trim: true
    },
    zip: {
        type: String,
        required: [true, 'Postal / ZIP code is required'],
        trim: true
    }
}, { _id: false });

// Main Order Schema
const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        default: generateOrderId
    },
    customer: {
        type: customerSchema,
        required: true
    },
    items: {
        type: [orderItemSchema],
        validate: {
            validator: (v) => Array.isArray(v) && v.length > 0,
            message: 'Order must contain at least one merchandise item'
        }
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total order amount is required'],
        min: [0, 'Total amount cannot be negative']
    },
    shippingFee: {
        type: Number,
        default: 0.00 // Complimentary orbital shipping
    },
    currency: {
        type: String,
        default: 'USD'
    },
    paymentMethod: {
        type: String,
        enum: ['demo_card', 'one_click', 'test_card', 'crypto', 'vip_tokens'],
        default: 'demo_card'
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'pending', 'authorized', 'failed', 'refunded'],
        default: 'paid'
    },
    orderStatus: {
        type: String,
        enum: ['confirmed', 'processing', 'orbital_transit', 'in_transit', 'delivered', 'cancelled'],
        default: 'confirmed'
    },
    trackingNumber: {
        type: String,
        default: generateTrackingNumber
    },
    estimatedDelivery: {
        type: Date,
        default: () => new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) // +4 Days
    },
    emailNotification: {
        dispatched: { type: Boolean, default: false },
        messageId: { type: String, default: null },
        previewUrl: { type: String, default: null },
        receiptFile: { type: String, default: null },
        dispatchedAt: { type: Date, default: null },
        dispatchMode: { type: String, default: 'pending' },
        error: { type: String, default: null }
    },
    notes: {
        type: String,
        default: 'Solar Explorer Official Mission Store Purchase'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

orderSchema.virtual('itemCount').get(function() {
    return this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
});

module.exports = mongoose.model('Order', orderSchema);

