import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthCredits } from './dto/google-auth.credits';
import { GoogleAuthService } from './google-auth.service';

@Controller('google/auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  @Redirect(`${process.env.FRONT_URI}`, 302)
  googleAuthRedirect(@Req() req: { user: GoogleAuthCredits }) {
    return this.googleAuthService.googleLogin(req);
  }
}
