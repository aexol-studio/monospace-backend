import { FieldResolveInput } from 'stucco-js';
import { mc } from '../db';
import { UserModel } from '../models/UserModel';
import { resolverFor } from '../zeus';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('UserMutation', 'setUsername', async (args, source: UserModel) => {
    const { db } = await mc();
    const result = await db
      .collection<UserModel>('User')
      .updateOne({ phoneNumber: source.phoneNumber }, { $set: { username: args.usernameSet.username } });
    return !!result.modifiedCount;
  })(input.arguments, input.source);
