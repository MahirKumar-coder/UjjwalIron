import mongoose from 'mongoose';

const GstBillSchema = new mongoose.Schema(
  {
    billNo: {
      type: String,
      required: [true, 'Please provide bill number'],
      unique: true,
      trim: true,
    },
    gstNo: {
      type: String,
      required: [true, 'Please provide customer GST number'],
      uppercase: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true,
    },
    billDate: {
      type: Date,
      required: [true, 'Please provide bill date'],
    },
    pdfUrl: {
      type: String,
      required: [true, 'Please provide uploaded GST bill PDF URL'],
      trim: true,
    },
    items: [
      {
        name: { type: String },
        qty: { type: Number },
        rate: { type: Number },
        total: { type: Number },
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
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.GstBill || mongoose.model('GstBill', GstBillSchema);
