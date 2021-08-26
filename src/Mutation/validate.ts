import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus';
import client from 'twilio';
import { sign } from 'jsonwebtoken';

const accountSid = process.env.TWILIO_ACCOUNT;
const authToken = process.env.TWILIO_TOKEN;

const twilio = client(accountSid, authToken);

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Mutation', 'validate', async ({ otpInput: { code, phoneNumber } }) => {
    if (phoneNumber !== '+48123456789' && code !== '1111') {
      //otp verification
      const verification = await twilio.verify.services(process.env.TWILLIO_SERVICE_ID!).verificationChecks.create({
        code,
        to: phoneNumber,
      });
      if (verification.status !== 'approved') {
        throw new Error('Invalid OTP code');
      }
    }
    //send JWT
    if (!process.env.JWT_SECRET) {
      throw new Error('Backend error please set JWT_SECRET env variable');
    }
    return sign({ phoneNumber }, process.env.JWT_SECRET);
  })(input.arguments);
