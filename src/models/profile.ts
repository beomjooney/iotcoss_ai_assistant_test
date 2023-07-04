export interface ProfileResponse {
  [key: string]: any;
  data: {
    data: Profile;
  };
}

export interface Friend {
  id: number;
  name: string;
}

export interface Skill {
  id: number;
  icon?: any;
  display_name: string;
  name?: any;
  label: string;
  __typename: string;
}

export interface Profile {
  _id: string;
  index: number;
  guid: string;
  isActive: boolean;
  balance: string;
  picture: string;
  age: number;
  eyeColor: string;
  name: string;
  gender: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  about: string;
  registered: string;
  latitude: number;
  longitude: number;
  tags: string[];
  friends: Friend[];
  skills: Skill[];
  greeting: string;
  favoriteFruit: string;
}
