/* Defining the type of the variables that will be passed to the mutation. */
export interface CreateUsernameVariables {
  username: string;
}

/* Defining the type of the data that will be returned from the mutation. */
export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface SearchUsersInputs {
  username: string;
}

export interface SearchUsersDara {
  searchUsers: Array<SearchedUser>;
}

export interface SearchedUser {
  id: string;
  username: string;
}
