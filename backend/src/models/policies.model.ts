import mongoose from 'mongoose';

export interface CPoliciesType {
  username: string,
  password: string,
  email: string,
  createdAt?: Date,
  updatedAt?: Date,
  jwt_refreshToken?: string,
}

const userSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, "Username is required"],
    trim: true
  },
  policies: {
    type: [{
      policy_name: { type: String, required: true },
      description: { type: String, required: true },
      coverage: { type: String, required: true },
      premium: { type: String, required: true },
      sold_last_month: { type: Number, required: true, "minimum": 0 }
    }],
    required: true,
  },
},
  {
    timestamps: true,
  }
)

export const CPolicies = mongoose.model('policies', userSchema);

