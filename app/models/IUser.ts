export type UserCredentialsRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string | undefined;
  profilePhoto: string | undefined;
  coverPhoto: string | undefined;
};

export type UserCredentialsResponse = UserCredentialsRequest & {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  profilePhotoId: string | undefined;
  coverPhotoId: string | undefined;
  events: Event[] | undefined;
};

export type ProfilePhotoRequest = {
  profilePhoto: string;
};

export type UsernameRequest = {
  username: string;
};
