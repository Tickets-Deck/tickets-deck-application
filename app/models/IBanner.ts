export type IAvatarConfig = {
  width: number;
  height: number;
  x: number;
  y: number;
  shape?: "circle" | "square";
}

export type ITextElementConfig = {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export type IBannerConfiguration = {
  frameImageUrl: string;
  avatar?: IAvatarConfig;
  textElements?: ITextElementConfig[];
}

export type ICreateBannerPayload = {
  title: string;
  description?: string;
  configuration: IBannerConfiguration;
}

export type IBanner = ICreateBannerPayload & {
  id: string;
  ownerId: string;
  generationCount: number;
  createdAt: string;
  updatedAt: string;
}

export type UploadBannerFrameResponse = {
    bannerImageId: string,
    bannerImageUrl: string
}