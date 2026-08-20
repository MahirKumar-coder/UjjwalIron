import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['ca_login', 'pdf_download'],
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: false,
  }
);

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
