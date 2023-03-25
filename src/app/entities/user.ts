import { BaseEntity, BaseEntityProps } from './base-entity';

export type Provider = 'local';

export interface UserProps {
  name: string;
  email: string;
  role: string;
  provider: Provider;
  password?: string | null;
  picture?: string | null;
}

export type CreateUserProps = UserProps & BaseEntityProps;

export class User extends BaseEntity<UserProps> {
  constructor({ id, createdAt, updatedAt, ...props }: CreateUserProps) {
    super({ id, createdAt, updatedAt });

    this.props = props;
  }

  public get name() {
    return this.props.name;
  }

  public set name(name: string) {
    this.props.name = name;
  }

  public get email() {
    return this.props.email;
  }

  public set email(email: string) {
    this.props.email = email;
  }

  public get role() {
    return this.props.role;
  }

  public set role(role: string) {
    this.props.role = role;
  }

  public get password() {
    return this.props.password;
  }

  public set password(password: string | undefined | null) {
    this.props.password = password;
  }

  public get picture() {
    return this.props.picture;
  }

  public set picture(picture: string | undefined | null) {
    this.props.picture = picture;
  }

  public get provider() {
    return this.props.provider;
  }

  public set provider(provider: Provider) {
    this.props.provider = provider;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...json } = super.toJSON();

    return json;
  }
}
