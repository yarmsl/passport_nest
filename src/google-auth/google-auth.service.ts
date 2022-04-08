import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { GoogleAuthCredits } from './dto/google-auth.credits';

@Injectable()
export class GoogleAuthService extends PassportStrategy(Strategy, 'google') {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    access_token: string,
    refresh_token: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      access_token,
    };
    done(null, user);
  }

  async googleLogin(req: { user: GoogleAuthCredits }) {
    if (!req.user) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }
    try {
      const user = await this.googleUser(req.user);
      const { access_token, refresh_token } =
        await this.authService.generateTokens(user, 'google');
      return {
        url: `${process.env.FRONT_URI}/authprovider/${access_token}/${refresh_token}`,
        statusCode: 302,
      };
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }
  }

  private async googleUser(googleUser: GoogleAuthCredits): Promise<User> {
    const { email, picture, firstName, lastName } = googleUser;
    const candidate = await this.userService.getUserByEmail(email);
    if (candidate) {
      candidate.photo = picture;
      await candidate.save();
      return candidate;
    } else {
      const password = await this.userService.hashPassword(`${email}sxc`);
      const user = await this.userService.createUser({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        photo: picture,
      });
      // const access_token = await this.authService.generateAccessToken(
      //   user,
      //   'google',
      // );
      // await this.userService.signupOnDataServer(access_token);
      return user;
    }
  }
}
