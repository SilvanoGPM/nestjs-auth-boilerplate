import { randomUUID } from 'node:crypto';

export interface BaseEntityProps {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class BaseEntity<T, O extends keyof T = never> {
  protected props: T;
  protected _id: string;
  protected _createdAt: string;
  protected _updatedAt: string;

  constructor(props: BaseEntityProps) {
    this._id = props.id ?? randomUUID();
    this._createdAt = props.createdAt ?? new Date().toISOString();
    this._updatedAt = props.updatedAt ?? new Date().toISOString();
  }

  public get id() {
    return this._id;
  }

  public get createdAt() {
    return this._createdAt;
  }

  public get updatedAt() {
    return this._updatedAt;
  }

  toJSON(): Omit<
    T & { _id: string; _createdAt?: string; _updatedAt?: string },
    O
  > {
    return {
      _id: this.id,
      _createdAt: this.createdAt,
      _updatedAt: this.updatedAt,
      ...this.props,
    };
  }
}
