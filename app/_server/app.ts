import { createApp, createIdentityProvider } from '@kottster/server';
import schema from '../../kottster-app.json';

/* 
 * For security, consider moving the secret data to environment variables.
 * See https://kottster.app/docs/deploying#before-you-deploy
 */
export const app = createApp({
  schema,
  secretKey: 'WuOgR0zzbXhsSb7bDN_drK3ZJl0ROUXJ',
  kottsterApiToken: 'iuQZZ0sFEyf9TVZqgKBE4q8noxZ8ZRhx',

  /*
   * The identity provider configuration.
   * See https://kottster.app/docs/app-configuration/identity-provider
   */
  identityProvider: createIdentityProvider('sqlite', {
    fileName: 'app.db',

    passwordHashAlgorithm: 'bcrypt',
    jwtSecretSalt: 'K9QJMoV9c_DTatBC',
    
    /* The root admin user credentials */
    rootUsername: 'admin',
    rootPassword: 'foobar',
  }),
});