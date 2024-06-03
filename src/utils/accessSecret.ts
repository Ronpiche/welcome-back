import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Storage } from '@google-cloud/storage';

export async function accessAllSecrets() {
  let client = new SecretManagerServiceClient();
  if (process.env.NODE_ENV === 'docker') {
    client = new SecretManagerServiceClient({
      authClient: await authenticateImplicitWithAdc(),
    });
  }
  const parent = process.env.NAME_PROJECT;
  const [secrets] = await client.listSecrets({
    parent: parent,
  });
  for await (const secret of secrets) {
    const [version] = await client.accessSecretVersion({
      name: secret.name + '/versions/latest',
    });
    const parts = secret.name.split('/');
    process.env[parts.pop()] = version.payload.data.toString();
  }
}

async function authenticateImplicitWithAdc() {
  const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: 'keyFileName/name-key-file.json',
  });
  const [buckets] = await storage.getBuckets({ maxResults: 1 });
  return buckets[0].parent['authClient']['cachedCredential'];
}
