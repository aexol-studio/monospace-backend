import { FieldResolveInput } from 'stucco-js';
import { mc } from '../db';
import { PostModel } from '../models/PostModel';
import { UserModel } from '../models/UserModel';
import { resolverFor } from '../zeus';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('User', 'wall', async (args, source: UserModel) => {
    const m = await mc();
    return m.db.collection<PostModel>('PostModel').find({ username: source.username }).toArray();
  })(input.arguments, input.source);
