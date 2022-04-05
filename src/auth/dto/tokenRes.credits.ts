import { ApiProperty } from '@nestjs/swagger';
export class AccessTokenRes {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImZpcnN0X25hbWUiOiJKaG9uIiwibGFzdF9uYW1lIjoiV2ljayIsInBob3RvIjpudWxsLCJlbWFpbCI6ImZnZGdkZ2RmZUByci50dHQiLCJwaG9uZSI6IjIxMzQzIiwiYWNjb3VudF90eXBlIjoiZW1haWwiLCJpYXQiOjE2NDkwNDYxNjQsImV4cCI6MTY0OTA0OTc2NH0.DSh-IE7q1Z3WOmm8YIOShRpQbzMZ-IvE7L2uCu3q2OM',
    description: 'Токен доступа',
  })
  access_token: string;
}
export class TokensRes extends AccessTokenRes {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImZpcnN0X25hbWUiOiJKaG9uIiwibGFzdF9uYW1lIjoiV2ljayIsInBob3RvIjpudWxsLCJlbWFpbCI6ImZnZGdkZ2RmZUByci50dHQiLCJwaG9uZSI6IjIxMzQzIiwiYWNjb3VudF90eXBlIjoiZW1haWwiLCJpYXQiOjE2NDkwNDYxNjQsImV4cCI6MTY0OTA0OTc2NH0.DSh-IE7q1Z3WOmm8YIOShRpQbzMZ-IvE7L2uCu3q2OM',
    description: 'Токен обновления',
  })
  refresh_token: string;
}
