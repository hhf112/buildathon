import mongoose from 'mongoose';

export interface PolicyType {
  policy_id: string,
  name: string,
  contract_end_date: string,
  payment_status: string,
  premium: string,
}

export interface ReferralType {
  has_referred: boolean,
  referral_code: string,
  reward_program_details: string,
}

export interface ClientType {
  name: string,   
  number: string,
  gender: string,
  email: string,  
  lang: string,   
  enrolled_policies: PolicyType[],  
  other_available_policies: string[],  
  referral_details: ReferralType,
}

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  numner: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  lang: {
    type: String,
    required: true,
  },
  enrolled_policies: {
    type: [{
      policy_id: String,
      name: String,
      contract_end_date: String,
      payment_status: String,
      premium: String,
    }],
    required: true,
  },
  other_available_policies: {
    type: [String],
    required: true,
  },
  referral_details: {
    type: {
      has_referred: Boolean,
      referral_code: String,
      reward_program_details: String,
    },
    required: true,
  },
}, {
  timestamps: true,
});

export const Client = mongoose.model('client', clientSchema);
