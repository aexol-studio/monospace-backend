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
      content: {
        content: args.postCreate.content,
        /**
         * Files to new post should be inserted from source
         * atfter user uploads them to s3
         */
        files: source.uploadedFiles
      },
    });

    /** 
     * delete uploaded files since they are useless now
     * and will be added to next post which shouldnt contain files
     */
    await db.collection<UserModel>('UserCol').updateOne(
      {username: source.username},
      {
        $set: {
          uploadedFiles: []
        }
      }
    )
    return id.insertedId.toHexString();
  
})(input.arguments, input.source);
