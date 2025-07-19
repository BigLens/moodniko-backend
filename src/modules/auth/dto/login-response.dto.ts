export class LoginResponseDto {
  accessToken: string;
  user: {
    id: number;
    email: string;
  };
}
