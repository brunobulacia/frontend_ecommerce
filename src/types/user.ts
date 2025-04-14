export interface createUser {
    user: string;
    password: string;
    fullName: string;
  }


export interface UserLogin {
    username: string;
    password: string;
}

export interface Profile {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}
