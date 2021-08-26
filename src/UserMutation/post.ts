import { FieldResolveInput } from 'stucco-js';
import { mc } from '../db';
import { PostModel } from '../models/PostModel';
import { UserModel } from '../models/UserModel';
import { resolverFor } from '../zeus';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('UserMutation', 'post', async (args, source: UserModel) => {
    const { db } = await mc();
    const id = await db.collection<PostModel>('Post').insertOne({
      createdAt: new Date().toISOString(),
      username: source.username,
      content: args.postCreate.content,
    });
    return id.insertedId.toHexString();
  })(input.arguments, input.source);
