export type UserCredentialsRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string | undefined;
  image: string | undefined;
};

export type UserCredentialsResponse = UserCredentialsRequest & {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  events: Event[];
};
