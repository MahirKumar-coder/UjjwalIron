import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      trim: true,
      maxlength: [15, 'Phone number cannot be more than 15 characters'],
    },
    productNeeded: {
      type: String,
      trim: true,
      maxlength: [200, 'Product details cannot exceed 200 characters'],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Closed'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
