import "next-auth";

declare module "next-auth" {
  /* Defining the shape of the session object that is returned by the provider. */
  interface Session {
    user: User;
  }

  /* Defining the shape of the user object that is returned by the provider. */
  interface User {
    id: string;
    username: string;
  }
}
