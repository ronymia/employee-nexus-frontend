export interface IProfile {
  id: number;
  fullName: string;
  userId: number;
  address: string;
  city: string;
  country: string;
  dateOfBirth: string; // format "DD-MM-YYYY"
  gender: "MALE" | "FEMALE";
  maritalStatus: "SINGLE" | "MARRIED";
  phone: string;
  postcode: string;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  roleId: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedBy: Date;
  profile: IProfile;
}
