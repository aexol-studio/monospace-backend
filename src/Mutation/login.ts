import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus';
import client from 'twilio';
import { mc } from '../db';
import { UserModel } from '../models/UserModel';

const accountSid = process.env.TWILIO_ACCOUNT;
const authToken = process.env.TWILIO_TOKEN;

const twilio = client(accountSid, authToken);

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Mutation', 'login', async (args) => {
    if (args.loginInput.phoneNumber !== '+48123456789') {
      //check if exists
      const { db } = await mc();
      const userCollection = db.collection<UserModel>('User');
      const theUser = await userCollection.findOneAndUpdate(
        { phoneNumber: args.loginInput.phoneNumber },
        {
          $setOnInsert: {
            createdAt: new Date().toISOString(),
            phoneNumber: args.loginInput.phoneNumber,
          },
        },
      );
      if (!theUser) {
        throw new Error('No user with inserted number in database!');
      }
      //send otp
      const result = await twilio.verify
        .services(process.env.TWILLIO_SERVICE_ID!)
        .verifications.create({ to: args.loginInput.phoneNumber, channel: 'sms' })
        .then((verification) => verification.status === 'pending')
        .catch((e) => console.error('Problem with sending otp occurred: ', e));
      if (!result) return 'Problem with sending otp occurred';
    }
    return 'ok';
  })(input.arguments);
