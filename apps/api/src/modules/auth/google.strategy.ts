import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, emails, name, photos } = profile;
      
      // Extract user information from Google profile
      const email = emails[0].value;
      const firstName = name.givenName;
      const lastName = name.familyName;
      const avatar = photos[0].value;
      
      // Check if user already exists in our database
      let user = await this.usersService.findByEmail(email);
      
      if (!user) {
        // Create new user if doesn't exist
        user = await this.usersService.createWithGoogle({
          email,
          firstName,
          lastName,
          avatar,
          googleId: id,
          isEmailVerified: true,
        });
      } else {
        // Update existing user with Google info
        user = await this.usersService.updateGoogleInfo(user.id, {
          googleId: id,
          avatar: avatar || user.avatar,
          isEmailVerified: true,
        });
      }
      
      // Update last login
      await this.usersService.updateLastLogin(user.id);
      
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
