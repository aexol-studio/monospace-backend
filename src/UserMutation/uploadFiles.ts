import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus';
import { readFileSync, write } from 'fs';

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

      const fileContent = readFileSync(name);
      const expires = new Date(); expires.setSeconds(expires.getSeconds() + 1000);

      s3.putObject({
        Bucket: params.Bucket,
        Key: name,
        ContentType: type,
        Body: fileContent,
        Expires: expires,
      }, (err, data) => {
        if(err) throw new Error("Cannot upload file");
      });

       /**
       * !!! IMPORTANT NOTE !!!
       * 
       * getSignedUrl method for putUrl var
       * seems to not work properly as putObject method.
       * getSignedUrl for putUrl never returns 
       * proper URL. Looks like it has problem with 
       * putting object into AWS bucket
       * Code: SignatureDoesNotMatch
       * 
       * getSignedUrl for getUrl works properly 
       * after using s3.putObject(). Returns URL to file in db.
       * When using normal getSignedUrl after putUrl (s3.putObject not used)
       * returns error URL like there is no file in db.
       * Code: NoSuchKey
       * 
       * Currently I have no idea what is going on with putUrl.
       * Maybe should use asynchoronous getSignedUrl(operation, params, callback)
       * instead of synchronous getSignedUrl(operation, params) ?
       */

      const putUrl = s3.getSignedUrl('putObject', {
        Bucket: params.Bucket,
        Key: name,
        ContentType: type,
        Body: fileContent,
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
    return Promise.all(args.files.map(getS3links));
  })(input.arguments);
