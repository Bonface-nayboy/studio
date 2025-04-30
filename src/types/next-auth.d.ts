import type { DefaultSession, DefaultUser } from 'next-auth';

// Extend the built-in session/user types if you need to add custom properties
// like MongoDB user ID, role, etc.

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user?: {
      id?: string | null; // Add MongoDB user ID
    } & DefaultSession['user'];
    // Add other custom session properties here if needed
    // accessToken?: string;
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User extends DefaultUser {
    id?: string; // Add MongoDB user ID
    // Add other custom user properties from your database model here
    // role?: string;
    // mobileNumber?: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string;
    // Add custom JWT properties here
    id?: string; // MongoDB user ID
    // role?: string;
  }
}
