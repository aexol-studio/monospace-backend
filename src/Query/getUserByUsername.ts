import { FieldResolveInput } from 'stucco-js';
import { mc } from '../db';
import { UserModel } from '../models/UserModel';
import { resolverFor } from '../zeus';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Query', 'getUserByUsername', async (args) => {
    const m = await mc();
    const foundUser = await m.db.collection<UserModel>('UserCol').findOne({ username: args.userGet.username });
    if (!foundUser) {
      throw new Error(`User with username: "${args.userGet.username}" does not exist`);
    }
    return foundUser;
  })(input.arguments);
