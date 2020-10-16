export class AuthMessage {
  constructor(
    public success: boolean,
    public error: AuthError
  ) {}
}

class AuthError {
  constructor(
    public code: string,
    public message: string
  ) {}
}