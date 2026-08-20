import mongoose from 'mongoose';

const GstCustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true,
    },
    gstNo: {
      type: String,
      required: [true, 'Please provide GST number'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    mobileNo: {
      type: String,
      required: [true, 'Please provide mobile number'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email address'],
      trim: true,
    },
    downloadVerified: {
      type: Boolean,
      default: false,
    },
    tempOtp: {
      type: String,
    },
    tempOtpExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.GstCustomer || mongoose.model('GstCustomer', GstCustomerSchema);
