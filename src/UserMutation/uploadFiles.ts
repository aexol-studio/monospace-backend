import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus';
import AWS from 'aws-sdk';

interface S3Client {
  client: AWS.S3;
  bucket: string
}

function getRequriedEnv<T extends string>(v: T[]): Record<T, string> {
  const ret: Partial<Record<T, string>> = {};
  for (const k of v) {
    if (!(k in process.env)) {
      throw new Error(`${k} variable required but not set`);
    }
    ret[k] = process.env[k];
  }
  return ret as Record<T, string>;
}

let s3: S3Client | undefined;
function s3Client() {
  if (s3) return s3;
  const { SPACES_BUCKET, SPACES_REGION, SPACES_KEY, SPACES_SECRET } = getRequriedEnv([
    'SPACES_BUCKET',
    'SPACES_REGION',
    'SPACES_KEY',
    'SPACES_SECRET',
  ]);
  const spacesEndpoint = new AWS.Endpoint(`${process.env.SPACES_REGION}.digitaloceanspaces.com`);
  s3 = {
    client: new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: process.env.SPACES_KEY,
      secretAccessKey: process.env.SPACES_SECRET,
    }),
    bucket: SPACES_BUCKET,
  }
  return s3;
}


const getS3links = async ({
  name,
  type,
}: {
  name: string;
  type: string;
}): Promise<{
  putUrl: string;
  getUrl: string;
}> => {
  const s3 = s3Client();
  const params = {
    Bucket: s3.bucket,
  };
  await new Promise<void>((resolve) => s3.client.createBucket(params, (err) => {
    if (err) console.log(err);
    resolve();
  }));

  const expires = 24 * 60 * 60; // 24h
  const urlParams = { ...params, Key: name, Expires: expires };
  const putUrl = s3.client.getSignedUrl('putObject', {
    ...urlParams,
    ContentType: type,
    ACL: 'public-read',
  });
  const getUrl = s3.client.getSignedUrl('getObject', urlParams);
  return { putUrl, getUrl };
}

export const handler = async (input: FieldResolveInput) =>
  resolverFor('UserMutation', 'uploadFiles', (args) => Promise.all(args.files.map(getS3links))
)(input.arguments);