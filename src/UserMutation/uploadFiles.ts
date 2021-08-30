import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus';

import AWS from 'aws-sdk';

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
    const params = {
      Bucket: 'mono',
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
      });
      const getUrl = s3.getSignedUrl('getObject', {
        Bucket: params.Bucket,
        Key: name,
        Expires: 1000,
      });

      resolve({ putUrl, getUrl });
    });
  });

export const handler = async (input: FieldResolveInput) =>
  resolverFor('UserMutation', 'uploadFiles', async (args) => {
    const links = await Promise.all(args.files.map(getS3links));
    return links;
  })(input.arguments);
