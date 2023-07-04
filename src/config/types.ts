export const ArticleEnum = {
  ARTICLE: '0001',
  VOD: '0002',
  SEMINAR: '0003',
  MENTOR_SEMINAR: '0005',
} as const;

export type ArticleType = typeof ArticleEnum[keyof typeof ArticleEnum];

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

export type JobGroupType = typeof JobGroupEnum[keyof typeof JobGroupEnum];
