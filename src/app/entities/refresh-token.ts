import { BaseEntity, BaseEntityProps } from './base-entity';
import { User } from './user';

export interface RefreshTokenProps {
  token: string;
  browser: string;
  os: string;
  user: User;
}

export type CreateRefreshTokenProps = RefreshTokenProps & BaseEntityProps;

export class RefreshToken extends BaseEntity<RefreshTokenProps> {
  constructor({ id, createdAt, updatedAt, ...props }: CreateRefreshTokenProps) {
    super({ id, createdAt, updatedAt });

    this.props = props;
  }

  public get token() {
    return this.props.token;
  }

  public set token(token: string) {
    this.props.token = token;
  }

  public get browser() {
    return this.props.browser;
  }

  public set browser(browser: string) {
    this.props.browser = browser;
  }

  public get os() {
    return this.props.os;
  }

  public set os(os: string) {
    this.props.os = os;
  }

  public get user() {
    return this.props.user;
  }

  public set user(user: User) {
    this.props.user = user;
  }
}
