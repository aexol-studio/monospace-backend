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
      const userCollection = db.collection<UserModel>('UserCol');
      
      // Now user is being found by username not phone number
      // Can create many accounts with one phone number
      // but cannot create many accounts with one username
      // username should be unique
      const theUser = await userCollection.findOne({ username: args.loginInput.username });
      if (!theUser) {
        await userCollection.insertOne({
          createdAt: new Date().toISOString(),
          phoneNumber: args.loginInput.phoneNumber,
          username: args.loginInput.username,
          wall: [],
        });
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
