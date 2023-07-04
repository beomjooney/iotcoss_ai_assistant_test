import { Meta, Story } from '@storybook/react';
import GrowthFieldCard, { GrowthFieldCardProps } from './index';
import { JobGroupEnum } from 'src/config/types';

export default {
  title: 'Components/GrowthFieldCard',
  component: GrowthFieldCard,
  parameters: {
    componentSubtitle: "display flex element 밑에서 정상 동작합니다. (ex - className='row')",
  },
} as Meta<GrowthFieldCardProps>;

const Template: Story = args => {
  return <GrowthFieldCard type={JobGroupEnum.Plan} {...args} />;
};

export const Planner = Template.bind({});
Planner.args = {
  type: JobGroupEnum.Plan,
  title: '서비스 운영/관리',
  description: '서비스 운영/관리 분야에 대한 간단한 설명을 적는 텍스트란 입니다.',
};

export const Designer = Template.bind({});
Designer.args = {
  type: JobGroupEnum.Design,
  icon: 'ti-palette',
  title: '디자인',
  description: '디자인 분야에 대한 간단한 설명을 적는 텍스트란 입니다.',
};

export const Developer = Template.bind({});
Developer.args = {
  type: JobGroupEnum.Develop,
  icon: 'ti-desktop',
  title: 'SW개발',
  description: 'SW개발 분야에 대한 간단한 설명을 적는 텍스트란 입니다.',
};

export const Engineer = Template.bind({});
Engineer.args = {
  type: JobGroupEnum.Engineering,
  icon: 'ti-signal',
  title: '엔지니어링',
  description: '엔지니어링 분야에 대한 간단한 설명을 적는 텍스트란 입니다.',
  link: 'https://www.naver.com',
};
