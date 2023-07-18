import { ComponentType } from 'react';

export const ArticleEnum = {
  ARTICLE: '0001',
  VOD: '0002',
  SEMINAR: '0003',
  MENTOR_SEMINAR: '0005',
} as const;

export type ArticleType = (typeof ArticleEnum)[keyof typeof ArticleEnum];

// color 매칭을 위하여 정의
// 백엔드 쪽에서 받아야하나..?
interface JobGroupEnumType {
  [index: string]: string;
}

export const JobGroupEnum = {
  plan: '0100',
  design: '0200',
  develop: '0300',
  engineering: '0400',
} as JobGroupEnumType;

export type JobGroupType = (typeof JobGroupEnum)[keyof typeof JobGroupEnum];

export type Route<T = string> = string;
export type PathName = Route<string>;
export interface Page {
  path: PathName;
  component: ComponentType<Object>;
}

//  ######  CustomLink  ######## //
export interface CustomLink {
  label: string;
  href: Route;
  targetBlank?: boolean;
}

//  ##########  PostDataType ######## //
export interface TaxonomyType {
  id: string | number;
  name: string;
  href: Route;
  count?: number;
  thumbnail?: string;
  desc?: string;
  color?: TwMainColor | string;
  taxonomy: 'category' | 'tag';
}

export interface PostAuthorType {
  id: string | number;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar: string;
  bgImage?: string;
  email?: string;
  count: number;
  desc: string;
  jobName: string;
  href: Route;
}

export interface PostDataType {
  id: string | number;
  author: PostAuthorType;
  date: string;
  href: Route;
  categories: TaxonomyType[];
  title: string;
  featuredImage: string;
  desc?: string;
  like: {
    count: number;
    isLiked: boolean;
  };
  bookmark: {
    count: number;
    isBookmarked: boolean;
  };
  commentCount: number;
  viewdCount: number;
  readingTime: number;
  postType: 'standard' | 'video' | 'gallery' | 'audio';
  videoUrl?: string;
  audioUrl?: string | string[];
  galleryImgs?: string[];
}

export type TwMainColor = 'pink' | 'green' | 'yellow' | 'red' | 'indigo' | 'blue' | 'purple' | 'gray';
