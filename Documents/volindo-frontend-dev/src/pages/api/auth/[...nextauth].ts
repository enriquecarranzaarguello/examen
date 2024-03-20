import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Auth } from 'aws-amplify';
import config from '@config';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export const authOptions: NextAuthOptions = {
  secret: config.next_auth_secret,
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Cognito',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      authorize: async credentials => {
        if (!credentials?.email && !credentials?.password) return null;

        try {
          const response = await Auth.signIn(
            credentials.email,
            credentials.password
          );

          const user = {
            id: response.username,
            name: response.attributes.name,
            email: credentials.email,
            tokens: {
              idToken: response.signInUserSession.idToken.jwtToken,
              refreshToken: response.signInUserSession.refreshToken.token,
              accessTokenExp:
                response.signInUserSession.accessToken.payload.exp,
            },
          };

          return user;
        } catch (ex) {
          // There was an error on signing in.
          throw ex;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token, trigger }) {
      // Getting data from sign-in (authorize) cause user is only available on sign-in
      if (user) {
        token.idToken = (user as any).tokens.idToken;
        token.refreshToken = (user as any).tokens.refreshToken;
        token.accessTokenExp = (user as any).tokens.accessTokenExp * 1000; // UTC miliseconds
        token.expired = false;
      }

      const isAccessTokenExpired =
        token.accessTokenExp && Date.now() > (token as any).accessTokenExp;
      const userRequestedUpdate = trigger === 'update';

      // Refreshing IdToken and AccessToken
      if (isAccessTokenExpired || userRequestedUpdate) {
        const newTokens = await refreshSessionTokens(
          token.refreshToken as string
        );

        if (!newTokens) token.expired = true;
        else {
          token.idToken = newTokens.idToken;
          token.accessTokenExp = newTokens.accessTokenExp * 1000; // UTC miliseconds
        }
      }

      return token;
    },
    async session({ session, token }) {
      const customSession = session as any;
      customSession.user.agent_id = token.sub;
      customSession.user.id_token = token.idToken;
      customSession.user.expired = token?.expired;
      delete customSession.user.image;
      return customSession;
    },
  },
  pages: {
    signIn: '/',
    signOut: '/',
  },
};

const refreshSessionTokens = async (refreshToken: string) => {
  const bodyParams = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: config.cognito_app_client_id || '',
    refresh_token: refreshToken,
  });

  try {
    const response = await axios.post(
      `https://${config.cognito_domain}/oauth2/token`,
      bodyParams,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const idToken = response.data.id_token;
    const decoded: any = jwtDecode(idToken);

    return {
      idToken: response.data.id_token,
      accessTokenExp: Number(decoded.exp),
    };
  } catch (ex) {
    // No current user cause refresh token expired
    return null;
  }
};

export default NextAuth(authOptions);
