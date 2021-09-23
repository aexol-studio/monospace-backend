import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus';
import AWS from 'aws-sdk';
import { UserModel } from '../models/UserModel';
import { mc } from '../db';

const spacesEndpoint = new AWS.Endpoint(`${process.env.SPACES_REGION}.digitaloceanspaces.com`);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});

const getS3links = async ({
  name,
  type,
}: {
  name: string;
  type: string;
}): Promise<{
  putUrl: string;
  getUrl: string;
}> =>
  new Promise((resolve) => {
    if (!process.env.SPACES_BUCKET) {
      throw new Error('Please specify SPACES_BUCKET environment variable');
    }
    const params = {
      Bucket: process.env.SPACES_BUCKET,
    };
    
    s3.createBucket(params, function (err, data) {
      if (err) {
        console.log('Bucket exists');
      }

      const putUrl = s3.getSignedUrl('putObject', {
        Bucket: params.Bucket,
        Key: name,
        ContentType: type,
        Expires: 1000,
        ACL: 'public-read-write',
      });

      const getUrl = s3.getSignedUrl('getObject', {
        Bucket: params.Bucket,
        Key: name,
        // should never expired?
        // for example expires in 100 years
        Expires: 1000,
      });

      /** 
       * current: getUrl = https://BUCKET.REGION.digitaloceanspaces.com/filename?AWSAccessKeyId=(...)&Expires=(...)&Signature=(...)
       * 
       * TODO: getUrl = https://BUCKET.REGION.digitaloceanspaces.com/username/filename 
       */  
      resolve({ putUrl, getUrl });
    });
  });

export const handler = async (input: FieldResolveInput) =>
  resolverFor('UserMutation', 'uploadFiles', async (args, source: UserModel) => {
    
    const urls = Promise.all(args.files.map(getS3links));
    const getUrls = (await urls).map((c) => c.getUrl).map((url) => ({getUrl: url}));

    const { db } = await mc();
    await db.collection<UserModel>('UserCol').updateOne(
      { username: source.username },
      {
        $set: {
          uploadedFiles: getUrls,
        }
      },
    );

    return urls;
  })(input.arguments, input.source);
