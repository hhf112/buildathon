import mongoose from 'mongoose';

export interface UserType {
  number: string,
  password: string,
  email: string,
  createdAt?: Date,
  updatedAt?: Date,
  jwt_refreshToken?: string,
}

const userSchema = new mongoose.Schema({
  number: {
    type: String,
    required: [true, "number is required"],
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true
  },
  jwt_refreshToken: {
    type: String,
    required: false,
  },
  access: {
    type: Number, //  insurer or customer.
    required: true
  },
  twitter: {
    type: {
      username: String,
      password: String,
    },
    required: false,
    default: null
  }
},
  {
    timestamps: true,
  }
)

export const User = mongoose.model('user', userSchema);

