import mongoose from 'mongoose';

const QuotationSchema = new mongoose.Schema(
  {
    quotationNo: {
      type: String,
      required: [true, 'Please provide a quotation number'],
      unique: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide customer phone number'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    gstNo: {
      type: String,
      uppercase: true,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    validityDays: {
      type: Number,
      default: 7,
    },
    items: [
      {
        name: { type: String, required: true },
        brand: { type: String },
        specification: { type: String },
        qty: { type: Number, required: true },
        unit: { type: String, default: 'Pcs' },
        rate: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    cgst: {
      type: Number,
      default: 0,
    },
    sgst: {
      type: Number,
      default: 0,
    },
    igst: {
      type: Number,
      default: 0,
    },
    loadingCharges: {
      type: Number,
      default: 0,
    },
    transportCharges: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    totalTax: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    terms: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Quotation || mongoose.model('Quotation', QuotationSchema);
