// groups.js

export const dayGroup = [
  {
    id: '월',
    groupId: '0001',
    name: '월',
    description: '월',
    order: 1,
  },
  {
    id: '화',
    groupId: '0001',
    name: '화',
    description: '화',
    order: 2,
  },
  {
    id: '수',
    groupId: '0001',
    name: '수',
    description: '수',
    order: 3,
  },
  {
    id: '목',
    groupId: '0001',
    name: '목',
    description: '목',
    order: 3,
  },
  {
    id: '금',
    groupId: '0001',
    name: '금',
    description: '금',
    order: 3,
  },
  {
    id: '토',
    groupId: '0001',
    name: '토',
    description: '토',
    order: 4,
  },
  {
    id: '일',
    groupId: '0001',
    name: '일',
    description: '일',
    order: 4,
  },
];

export const images = [
  '/assets/images/banner/Rectangle_190.png',
  '/assets/images/banner/Rectangle_191.png',
  '/assets/images/banner/Rectangle_192.png',
  '/assets/images/banner/Rectangle_193.png',
  '/assets/images/banner/Rectangle_195.png',
  '/assets/images/banner/Rectangle_196.png',
  '/assets/images/banner/Rectangle_197.png',
  '/assets/images/banner/Rectangle_198.png',
  '/assets/images/banner/Rectangle_199.png',
];

export const privateGroup = [
  {
    id: '0100',
    groupId: '0001',
    name: '공개',
    description: '공개',
    active: true,
    order: 1,
  },
  {
    id: '0200',
    groupId: '0001',
    name: '비공개',
    description: '비공개',
    active: false,
    order: 2,
  },
];

export const levelGroup = [
  {
    name: '0',
    description: '1학년',
  },
  {
    name: '1',
    description: '2학년',
  },
  {
    name: '2',
    description: '3학년',
  },
  {
    name: '3',
    description: '4학년',
  },
  {
    name: '4',
    description: '취업준비생',
  },
  {
    name: '5',
    description: '상관없음',
  },
];

export const openGroup = [
  {
    name: '0100',
    description: '정기 자동 오픈',
  },
  {
    name: '0200',
    description: '교수자 수동 오픈',
  },
  {
    name: '0300',
    description: '학습자 학습 오픈',
  },
];
