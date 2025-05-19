export class RefreshToken {
  constructor(
    private readonly _id: string | null,
    private readonly _userId: string,
    private readonly _token: string,
    private readonly _expiresAt: Date,
    private readonly _isRevoked: boolean,
  ) {}

  get id(): string | null {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get token(): string {
    return this._token;
  }

  get expiresAt(): Date {
    return this._expiresAt;
  }

  get isRevoked(): boolean {
    return this._isRevoked;
  }
}
