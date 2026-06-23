import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async createWithGoogle(userData: {
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    googleId: string;
    isEmailVerified: boolean;
  }): Promise<User> {
    // Check if user already exists
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    // Generate username from email
    const username = userData.email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 8);

    // Create new user
    const user = this.userRepository.create({
      id: uuidv4(),
      email: userData.email,
      username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      avatar: userData.avatar,
      googleId: userData.googleId,
      isEmailVerified: userData.isEmailVerified,
      isActive: true,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.userRepository.save(user);
  }

  async updateGoogleInfo(userId: string, googleData: {
    googleId: string;
    avatar?: string;
    isEmailVerified: boolean;
  }): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.update(userId, {
      googleId: googleData.googleId,
      avatar: googleData.avatar || user.avatar,
      isEmailVerified: googleData.isEmailVerified,
      updatedAt: new Date(),
    });

    return this.findById(userId);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      lastLoginAt: new Date(),
    });
  }

  async updateProfile(userId: string, profileData: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    country?: string;
    city?: string;
    language?: string;
    timezone?: string;
    currency?: string;
  }): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.update(userId, {
      ...profileData,
      updatedAt: new Date(),
    });

    return this.findById(userId);
  }

  async updatePrivacySettings(userId: string, privacyData: {
    profileVisibility?: string;
    showEmail?: boolean;
    showPhone?: boolean;
    showBirthday?: boolean;
    showLocation?: boolean;
  }): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.update(userId, {
      privacy: {
        ...user.privacy,
        ...privacyData,
      },
      updatedAt: new Date(),
    });

    return this.findById(userId);
  }

  async updateNotificationSettings(userId: string, notificationData: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    marketing?: boolean;
    security?: boolean;
  }): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.update(userId, {
      notifications: {
        ...user.notifications,
        ...notificationData,
      },
      updatedAt: new Date(),
    });

    return this.findById(userId);
  }

  async updateSocialLinks(userId: string, socialLinks: {
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  }): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.update(userId, {
      socialLinks: {
        ...user.socialLinks,
        ...socialLinks,
      },
      updatedAt: new Date(),
    });

    return this.findById(userId);
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.update(userId, {
      avatar: avatarUrl,
      updatedAt: new Date(),
    });

    return this.findById(userId);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // If user has password (not Google-only user), verify current password
    if (user.password) {
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new HttpException('Current password is incorrect', HttpStatus.BAD_REQUEST);
      }
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepository.update(userId, {
      password: hashedNewPassword,
      updatedAt: new Date(),
    });
  }

  async enable2FA(userId: string, twoFactorSecret: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.update(userId, {
      twoFactorSecret,
      twoFactorEnabled: true,
      updatedAt: new Date(),
    });

    return this.findById(userId);
  }

  async disable2FA(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.update(userId, {
      twoFactorSecret: null,
      twoFactorEnabled: false,
      updatedAt: new Date(),
    });

    return this.findById(userId);
  }

  async deactivateAccount(userId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.update(userId, {
      isActive: false,
      deactivatedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async reactivateAccount(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.update(userId, {
      isActive: true,
      deactivatedAt: null,
      updatedAt: new Date(),
    });

    return this.findById(userId);
  }

  async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username ILIKE :query OR user.firstName ILIKE :query OR user.lastName ILIKE :query', {
        query: `%${query}%`,
      })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .limit(limit)
      .getMany();
  }

  async getUserStats(userId: string): Promise<any> {
    const user = await this.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // This would typically involve querying other tables for user statistics
    return {
      totalPosts: 0,
      totalStreams: 0,
      totalViews: 0,
      followers: 0,
      following: 0,
      joinDate: user.createdAt,
      lastLogin: user.lastLoginAt,
    };
  }
}
