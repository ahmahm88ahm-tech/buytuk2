import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.posts)
  user: User;

  @Column('text')
  content: string;

  @Column('jsonb')
  platforms: string[];

  @Column('jsonb', { nullable: true })
  images?: Array<{
    filename: string;
    size: number;
    format: string;
    url?: string;
  }>;

  @Column('jsonb', { nullable: true })
  videos?: Array<{
    filename: string;
    size: number;
    format: string;
    duration: number;
    url?: string;
  }>;

  @Column('jsonb', { nullable: true })
  hashtags?: string[];

  @Column('jsonb', { nullable: true })
  mentions?: string[];

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  scheduledAt?: Date;

  @Column({ nullable: true })
  publishedAt?: Date;

  @Column({ default: 'draft' })
  status: 'draft' | 'published' | 'scheduled' | 'failed';

  @Column('jsonb', { nullable: true })
  settings?: {
    allowComments: boolean;
    allowSharing: boolean;
    visibility: 'public' | 'private' | 'friends';
  };

  @Column('jsonb', { nullable: true })
  validationResults?: Array<{
    platform: string;
    isValid: boolean;
    warnings: string[];
    errors: string[];
    characterCount: number;
    imageCount: number;
    videoCount: number;
    characterUsage: number;
  }>;

  @Column('jsonb', { nullable: true })
  analytics?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    engagement: number;
    platformData: Record<string, {
      views: number;
      likes: number;
      shares: number;
      comments: number;
      engagement: number;
    }>;
  };

  @Column('jsonb', { nullable: true })
  platformIds?: Record<string, string>; // Store platform-specific post IDs

  @Column({ nullable: true })
  errorMessage?: string;

  @Column({ nullable: true })
  retryCount?: number;

  @Column({ nullable: true })
  lastRetryAt?: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  deletedAt?: Date;

  @Column({ nullable: true })
  deletedBy?: string;

  @Column({ default: false })
  isArchived: boolean;

  @Column({ nullable: true })
  archivedAt?: Date;

  @Column({ nullable: true })
  archivedBy?: string;

  @Column({ nullable: true })
  campaignId?: string;

  @Column({ nullable: true })
  templateId?: string;

  @Column('jsonb', { nullable: true })
  tags?: string[];

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @Column({ default: 0 })
  totalViews: number;

  @Column({ default: 0 })
  totalLikes: number;

  @Column({ default: 0 })
  totalShares: number;

  @Column({ default: 0 })
  totalComments: number;

  @Column({ default: 0 })
  averageEngagement: number;

  @Column({ nullable: true })
  performanceScore?: number;

  @Column({ nullable: true })
  bestPerformingPlatform?: string;

  @Column({ nullable: true })
  peakEngagementTime?: Date;

  @Column({ default: false })
  isViral: boolean;

  @Column({ nullable: true })
  viralAt?: Date;

  @Column({ default: false })
  isBoosted: boolean;

  @Column({ nullable: true })
  boostedAt?: Date;

  @Column({ nullable: true })
  boostedUntil?: Date;

  @Column({ nullable: true })
  boostBudget?: number;

  @Column({ nullable: true })
  boostTargeting?: Record<string, any>;

  @Column({ default: false })
  isPinned: boolean;

  @Column({ nullable: true })
  pinnedAt?: Date;

  @Column({ nullable: true })
  pinnedUntil?: Date;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ nullable: true })
  featuredAt?: Date;

  @Column({ nullable: true })
  featuredUntil?: Date;

  @Column({ default: false })
  isSponsored: boolean;

  @Column({ nullable: true })
  sponsoredBy?: string;

  @Column({ nullable: true })
  sponsoredAt?: Date;

  @Column({ nullable: true })
  sponsoredUntil?: Date;

  @Column({ default: false })
  isModerated: boolean;

  @Column({ nullable: true })
  moderatedAt?: Date;

  @Column({ nullable: true })
  moderatedBy?: string;

  @Column({ nullable: true })
  moderationStatus?: 'pending' | 'approved' | 'rejected';

  @Column({ nullable: true })
  moderationReason?: string;

  @Column({ default: false })
  isReported: boolean;

  @Column({ nullable: true })
  reportedAt?: Date;

  @Column({ nullable: true })
  reportedBy?: string;

  @Column({ nullable: true })
  reportReason?: string;

  @Column({ default: false })
  isEdited: boolean;

  @Column({ nullable: true })
  editedAt?: Date;

  @Column({ nullable: true })
  editedBy?: string;

  @Column({ nullable: true })
  originalContent?: string;

  @Column({ default: false })
  isReposted: boolean;

  @Column({ nullable: true })
  repostedAt?: Date;

  @Column({ nullable: true })
  repostedBy?: string;

  @Column({ nullable: true })
  originalPostId?: string;

  @Column({ default: false })
  isQuoted: boolean;

  @Column({ nullable: true })
  quotedAt?: Date;

  @Column({ nullable: true })
  quotedBy?: string;

  @Column({ nullable: true })
  quotedPostId?: string;

  @Column({ default: false })
  isReply: boolean;

  @Column({ nullable: true })
  repliedAt?: Date;

  @Column({ nullable: true })
  repliedBy?: string;

  @Column({ nullable: true })
  replyToPostId?: string;

  @Column({ default: false })
  isThread: boolean;

  @Column({ nullable: true })
  threadId?: string;

  @Column({ nullable: true })
  threadPosition?: number;

  @Column({ default: false })
  isPoll: boolean;

  @Column('jsonb', { nullable: true })
  pollOptions?: Array<{
    id: string;
    text: string;
    votes: number;
    percentage: number;
  }>;

  @Column({ nullable: true })
  pollEndsAt?: Date;

  @Column({ default: false })
  isQuiz: boolean;

  @Column('jsonb', { nullable: true })
  quizQuestions?: Array<{
    id: string;
    question: string;
    options: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
      votes: number;
    }>;
  }>;

  @Column({ nullable: true })
  quizEndsAt?: Date;

  @Column({ default: false })
  isContest: boolean;

  @Column('jsonb', { nullable: true })
  contestRules?: string[];

  @Column({ nullable: true })
  contestEndsAt?: Date;

  @Column({ nullable: true })
  contestWinner?: string;

  @Column({ nullable: true })
  contestPrize?: string;

  @Column({ default: false })
  isEvent: boolean;

  @Column({ nullable: true })
  eventStartAt?: Date;

  @Column({ nullable: true })
  eventEndAt?: Date;

  @Column({ nullable: true })
  eventLocation?: string;

  @Column({ nullable: true })
  eventAttendees?: number;

  @Column({ default: false })
  isLive: boolean;

  @Column({ nullable: true })
  liveStartAt?: Date;

  @Column({ nullable: true })
  liveEndAt?: Date;

  @Column({ nullable: true })
  liveViewers?: number;

  @Column({ default: false })
  isStory: boolean;

  @Column({ nullable: true })
  storyEndsAt?: Date;

  @Column({ default: false })
  isReel: boolean;

  @Column({ default: false })
  isShort: boolean;

  @Column({ default: false })
  isArticle: boolean;

  @Column({ nullable: true })
  articleUrl?: string;

  @Column({ nullable: true })
  articleTitle?: string;

  @Column({ nullable: true })
  articleDescription?: string;

  @Column({ nullable: true })
  articleImage?: string;

  @Column({ default: false })
  isLink: boolean;

  @Column({ nullable: true })
  linkUrl?: string;

  @Column({ nullable: true })
  linkTitle?: string;

  @Column({ nullable: true })
  linkDescription?: string;

  @Column({ nullable: true })
  linkImage?: string;

  @Column({ default: false })
  isAudio: boolean;

  @Column({ nullable: true })
  audioUrl?: string;

  @Column({ nullable: true })
  audioTitle?: string;

  @Column({ nullable: true })
  audioArtist?: string;

  @Column({ nullable: true })
  audioDuration?: number;

  @Column({ default: false })
  isGif: boolean;

  @Column({ nullable: true })
  gifUrl?: string;

  @Column({ nullable: true })
  gifTitle?: string;

  @Column({ nullable: true })
  gifDuration?: number;

  @Column({ default: false })
  isSticker: boolean;

  @Column({ nullable: true })
  stickerUrl?: string;

  @Column({ nullable: true })
  stickerTitle?: string;

  @Column({ default: false })
  isEmoji: boolean;

  @Column({ nullable: true })
  emojiCode?: string;

  @Column({ nullable: true })
  emojiTitle?: string;

  @Column({ default: false })
  isMention: boolean;

  @Column({ nullable: true })
  mentionUsername?: string;

  @Column({ nullable: true })
  mentionUserId?: string;

  @Column({ default: false })
  isHashtag: boolean;

  @Column({ nullable: true })
  hashtagText?: string;

  @Column({ nullable: true })
  hashtagCount?: number;

  @Column({ default: false })
  isUrl: boolean;

  @Column({ nullable: true })
  urlText?: string;

  @Column({ nullable: true })
  urlDomain?: string;

  @Column({ nullable: true })
  urlProtocol?: string;

  @Column({ default: false })
  isEmail: boolean;

  @Column({ nullable: true })
  emailText?: string;

  @Column({ nullable: true })
  emailDomain?: string;

  @Column({ default: false })
  isPhone: boolean;

  @Column({ nullable: true })
  phoneText?: string;

  @Column({ nullable: true })
  phoneCountry?: string;

  @Column({ default: false })
  isAddress: boolean;

  @Column({ nullable: true })
  addressText?: string;

  @Column({ nullable: true })
  addressCountry?: string;

  @Column({ nullable: true })
  addressCity?: string;

  @Column({ default: false })
  isDate: boolean;

  @Column({ nullable: true })
  dateText?: string;

  @Column({ nullable: true })
  dateFormat?: string;

  @Column({ default: false })
  isTime: boolean;

  @Column({ nullable: true })
  timeText?: string;

  @Column({ nullable: true })
  timeFormat?: string;

  @Column({ default: false })
  isCurrency: boolean;

  @Column({ nullable: true })
  currencyText?: string;

  @Column({ nullable: true })
  currencyCode?: string;

  @Column({ nullable: true })
  currencyValue?: number;

  @Column({ default: false })
  isNumber: boolean;

  @Column({ nullable: true })
  numberText?: string;

  @Column({ nullable: true })
  numberValue?: number;

  @Column({ nullable: true })
  numberFormat?: string;

  @Column({ default: false })
  isPercentage: boolean;

  @Column({ nullable: true })
  percentageText?: string;

  @Column({ nullable: true })
  percentageValue?: number;

  @Column({ default: false })
  isRating: boolean;

  @Column({ nullable: true })
  ratingValue?: number;

  @Column({ nullable: true })
  ratingMax?: number;

  @Column({ default: false })
  isPrice: boolean;

  @Column({ nullable: true })
  priceValue?: number;

  @Column({ nullable: true })
  priceCurrency?: string;

  @Column({ default: false })
  isCoordinate: boolean;

  @Column({ nullable: true })
  coordinateLatitude?: number;

  @Column({ nullable: true })
  coordinateLongitude?: number;

  @Column({ default: false })
  isColor: boolean;

  @Column({ nullable: true })
  colorCode?: string;

  @Column({ nullable: true })
  colorName?: string;

  @Column({ default: false })
  isSize: boolean;

  @Column({ nullable: true })
  sizeValue?: number;

  @Column({ nullable: true })
  sizeUnit?: string;

  @Column({ default: false })
  isWeight: boolean;

  @Column({ nullable: true })
  weightValue?: number;

  @Column({ nullable: true })
  weightUnit?: string;

  @Column({ default: false })
  isTemperature: boolean;

  @Column({ nullable: true })
  temperatureValue?: number;

  @Column({ nullable: true })
  temperatureUnit?: string;

  @Column({ default: false })
  isSpeed: boolean;

  @Column({ nullable: true })
  speedValue?: number;

  @Column({ nullable: true })
  speedUnit?: string;

  @Column({ default: false })
  isDistance: boolean;

  @Column({ nullable: true })
  distanceValue?: number;

  @Column({ nullable: true })
  distanceUnit?: string;

  @Column({ default: false })
  isVolume: boolean;

  @Column({ nullable: true })
  volumeValue?: number;

  @Column({ nullable: true })
  volumeUnit?: string;

  @Column({ default: false })
  isArea: boolean;

  @Column({ nullable: true })
  areaValue?: number;

  @Column({ nullable: true })
  areaUnit?: string;

  @Column({ default: false })
  isDuration: boolean;

  @Column({ nullable: true })
  durationValue?: number;

  @Column({ nullable: true })
  durationUnit?: string;

  @Column({ default: false })
  isFrequency: boolean;

  @Column({ nullable: true })
  frequencyValue?: number;

  @Column({ nullable: true })
  frequencyUnit?: string;

  @Column({ default: false })
  isEnergy: boolean;

  @Column({ nullable: true })
  energyValue?: number;

  @Column({ nullable: true })
  energyUnit?: string;

  @Column({ default: false })
  isPower: boolean;

  @Column({ nullable: true })
  powerValue?: number;

  @Column({ nullable: true })
  powerUnit?: string;

  @Column({ default: false })
  isPressure: boolean;

  @Column({ nullable: true })
  pressureValue?: number;

  @Column({ nullable: true })
  pressureUnit?: string;

  @Column({ default: false })
  isDensity: boolean;

  @Column({ nullable: true })
  densityValue?: number;

  @Column({ nullable: true })
  densityUnit?: string;

  @Column({ default: false })
  isConcentration: boolean;

  @Column({ nullable: true })
  concentrationValue?: number;

  @Column({ nullable: true })
  concentrationUnit?: string;

  @Column({ default: false })
  isViscosity: boolean;

  @Column({ nullable: true })
  viscosityValue?: number;

  @Column({ nullable: true })
  viscosityUnit?: string;

  @Column({ default: false })
  isConductivity: boolean;

  @Column({ nullable: true })
  conductivityValue?: number;

  @Column({ nullable: true })
  conductivityUnit?: string;

  @Column({ default: false })
  isResistivity: boolean;

  @Column({ nullable: true })
  resistivityValue?: number;

  @Column({ nullable: true })
  resistivityUnit?: string;

  @Column({ default: false })
  isCapacitance: boolean;

  @Column({ nullable: true })
  capacitanceValue?: number;

  @Column({ nullable: true })
  capacitanceUnit?: string;

  @Column({ default: false })
  isInductance: boolean;

  @Column({ nullable: true })
  inductanceValue?: number;

  @Column({ nullable: true })
  inductanceUnit?: string;

  @Column({ default: false })
  isResistance: boolean;

  @Column({ nullable: true })
  resistanceValue?: number;

  @Column({ nullable: true })
  resistanceUnit?: string;

  @Column({ default: false })
  isVoltage: boolean;

  @Column({ nullable: true })
  voltageValue?: number;

  @Column({ nullable: true })
  voltageUnit?: string;

  @Column({ default: false })
  isCurrent: boolean;

  @Column({ nullable: true })
  currentValue?: number;

  @Column({ nullable: true })
  currentUnit?: string;

  @Column({ default: false })
  isCharge: boolean;

  @Column({ nullable: true })
  chargeValue?: number;

  @Column({ nullable: true })
  chargeUnit?: string;

  @Column({ default: false })
  isMagneticField: boolean;

  @Column({ nullable: true })
  magneticFieldValue?: number;

  @Column({ nullable: true })
  magneticFieldUnit?: string;

  @Column({ default: false })
  isMagneticFlux: boolean;

  @Column({ nullable: true })
  magneticFluxValue?: number;

  @Column({ nullable: true })
  magneticFluxUnit?: string;

  @Column({ default: false })
  isMagneticFluxDensity: boolean;

  @Column({ nullable: true })
  magneticFluxDensityValue?: number;

  @Column({ nullable: true })
  magneticFluxDensityUnit?: string;

  @Column({ default: false })
  isElectricField: boolean;

  @Column({ nullable: true })
  electricFieldValue?: number;

  @Column({ nullable: true })
  electricFieldUnit?: string;

  @Column({ default: false })
  isElectricFlux: boolean;

  @Column({ nullable: true })
  electricFluxValue?: number;

  @Column({ nullable: true })
  electricFluxUnit?: string;

  @Column({ default: false })
  isElectricFluxDensity: boolean;

  @Column({ nullable: true })
  electricFluxDensityValue?: number;

  @Column({ nullable: true })
  electricFluxDensityUnit?: string;

  @Column({ default: false })
  isElectricPotential: boolean;

  @Column({ nullable: true })
  electricPotentialValue?: number;

  @Column({ nullable: true })
  electricPotentialUnit?: string;

  @Column({ default: false })
  isElectricPotentialEnergy: boolean;

  @Column({ nullable: true })
  electricPotentialEnergyValue?: number;

  @Column({ nullable: true })
  electricPotentialEnergyUnit?: string;

  @Column({ default: false })
  isElectricPower: boolean;

  @Column({ nullable: true })
  electricPowerValue?: number;

  @Column({ nullable: true })
  electricPowerUnit?: string;

  @Column({ default: false })
  isElectricEnergy: boolean;

  @Column({ nullable: true })
  electricEnergyValue?: number;

  @Column({ nullable: true })
  electricEnergyUnit?: string;

  @Column({ default: false })
  isElectricCharge: boolean;

  @Column({ nullable: true })
  electricChargeValue?: number;

  @Column({ nullable: true })
  electricChargeUnit?: string;

  @Column({ default: false })
  isElectricCurrentDensity: boolean;

  @Column({ nullable: true })
  electricCurrentDensityValue?: number;

  @Column({ nullable: true })
  electricCurrentDensityUnit?: string;

  @Column({ default: false })
  isElectricResistance: boolean;

  @Column({ nullable: true })
  electricResistanceValue?: number;

  @Column({ nullable: true })
  electricResistanceUnit?: string;

  @Column({ default: false })
  isElectricConductance: boolean;

  @Column({ nullable: true })
  electricConductanceValue?: number;

  @Column({ nullable: true })
  electricConductanceUnit?: string;

  @Column({ default: false })
  isElectricCapacitance: boolean;

  @Column({ nullable: true })
  electricCapacitanceValue?: number;

  @Column({ nullable: true })
  electricCapacitanceUnit?: string;

  @Column({ default: false })
  isElectricInductance: boolean;

  @Column({ nullable: true })
  electricInductanceValue?: number;

  @Column({ nullable: true })
  electricInductanceUnit?: string;

  @Column({ default: false })
  isElectricImpedance: boolean;

  @Column({ nullable: true })
  electricImpedanceValue?: number;

  @Column({ nullable: true })
  electricImpedanceUnit?: string;

  @Column({ default: false })
  isElectricAdmittance: boolean;

  @Column({ nullable: true })
  electricAdmittanceValue?: number;

  @Column({ nullable: true })
  electricAdmittanceUnit?: string;

  @Column({ default: false })
  isElectricSusceptance: boolean;

  @Column({ nullable: true })
  electricSusceptanceValue?: number;

  @Column({ nullable: true })
  electricSusceptanceUnit?: string;

  @Column({ default: false })
  isElectricPermittivity: boolean;

  @Column({ nullable: true })
  electricPermittivityValue?: number;

  @Column({ nullable: true })
  electricPermittivityUnit?: string;

  @Column({ default: false })
  isElectricPermeability: boolean;

  @Column({ nullable: true })
  electricPermeabilityValue?: number;

  @Column({ nullable: true })
  electricPermeabilityUnit?: string;

  @Column({ default: false })
  isElectricDipoleMoment: boolean;

  @Column({ nullable: true })
  electricDipoleMomentValue?: number;

  @Column({ nullable: true })
  electricDipoleMomentUnit?: string;

  @Column({ default: false })
  isElectricQuadrupoleMoment: boolean;

  @Column({ nullable: true })
  electricQuadrupoleMomentValue?: number;

  @Column({ nullable: true })
  electricQuadrupoleMomentUnit?: string;

  @Column({ default: false })
  isElectricPolarization: boolean;

  @Column({ nullable: true })
  electricPolarizationValue?: number;

  @Column({ nullable: true })
  electricPolarizationUnit?: string;

  @Column({ default: false })
  isElectricDisplacementField: boolean;

  @Column({ nullable: true })
  electricDisplacementFieldValue?: number;

  @Column({ nullable: true })
  electricDisplacementFieldUnit?: string;

  @Column({ default: false })
  isElectricMagnetization: boolean;

  @Column({ nullable: true })
  electricMagnetizationValue?: number;

  @Column({ nullable: true })
  electricMagnetizationUnit?: string;

  @Column({ default: false })
  isElectricTorque: boolean;

  @Column({ nullable: true })
  electricTorqueValue?: number;

  @Column({ nullable: true })
  electricTorqueUnit?: string;

  @Column({ default: false })
  isElectricWork: boolean;

  @Column({ nullable: true })
  electricWorkValue?: number;

  @Column({ nullable: true })
  electricWorkUnit?: string;

  @Column({ default: false })
  isElectricHeat: boolean;

  @Column({ nullable: true })
  electricHeatValue?: number;

  @Column({ nullable: true })
  electricHeatUnit?: string;

  @Column({ default: false })
  isElectricEfficiency: boolean;

  @Column({ nullable: true })
  electricEfficiencyValue?: number;

  @Column({ nullable: true })
  electricEfficiencyUnit?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
