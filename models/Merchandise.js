const mongoose = require('mongoose');

const merchandiseSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        default: () => 'MERCH-' + Date.now()
    },
    vipPassId: {
        type: String,
        required: true,
        unique: true,
        default: () => 'VIP-ORBIT-' + Math.floor(1000 + Math.random() * 9000)
    },
    name: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email address']
    },
    product: {
        type: String,
        required: [true, 'Product selection is required']
    },
    size: {
        type: String,
        required: [true, 'Apparel size is required'],
        enum: ['Small', 'Medium', 'Large', 'XL', '2XL', 'N/A'],
        default: 'Medium'
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        default: 1
    },
    suggestions: {
        type: String,
        default: 'None provided'
    },
    discount: {
        type: String,
        default: '20% VIP DISCOUNT'
    },
    status: {
        type: String,
        enum: ['reserved', 'confirmed', 'shipped', 'cancelled'],
        default: 'confirmed'
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Merchandise', merchandiseSchema);
