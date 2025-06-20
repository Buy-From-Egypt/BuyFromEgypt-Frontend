export type SocialMediaPlatform = 'facebook' | 'instagram' | 'tiktok' | 'x' | 'whatsapp' | 'linkedin';

export interface SocialMedia {
  id: string;
  userId: string;
  platform: SocialMediaPlatform;
  url: string;
  handle: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSocialMediaDto {
  platform: SocialMediaPlatform;
  url: string;
}

export interface UpdateSocialMediaDto extends Partial<CreateSocialMediaDto> {}

export const socialMediaPlatforms: { value: SocialMediaPlatform; label: string }[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'linkedin', label: 'LinkedIn' },
];
