import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    brand: {
      type: String,
      required: [true, 'Please provide the brand name (e.g., Tata, Jindal)'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide the category'],
      enum: {
        values: ['MS Pipes', 'Roofing Sheets', 'TMT Bars', 'GP Pipes', 'Angles & Channels', 'Other'],
        message: '{VALUE} is not a valid category',
      },
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    price: {
      type: String,
      default: 'On Request',
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '/images/placeholder.jpg',
    },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
