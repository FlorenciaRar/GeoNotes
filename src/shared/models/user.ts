export interface IUser {
  id: string;
  name: string;
  surname: string;
  birthdate?: string;
  email: string;
}

export class User implements IUser {
  id: string;
  name: string;
  surname: string;
  birthdate?: string;
  email: string;

  constructor(
    id: string,
    name: string,
    surname: string,
    email: string,
    birthdate?: string
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.birthdate = birthdate;
  }
}
