import { Story, Meta } from '@storybook/react';
import LevelCard, { LevelCardProps } from '.';

export default {
  component: LevelCard,
  title: 'Components/LevelCard',
  argTypes: {},
} as Meta;

const Template: Story<LevelCardProps> = ({ ...args }) => {
  return <LevelCard {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  levelTitle: '1레벨',
  levelSubTitle: '직무초보',
  levelContent: '다수 상용서비스 개발 리더. 수십명 혹은 수백명 수준의 개발자 총괄 리더',
};

export const Active = Template.bind({});
Active.args = {
  levelTitle: '1레벨',
  levelSubTitle: '직무초보',
  levelContent: '다수 상용서비스 개발 리더. 수십명 혹은 수백명 수준의 개발자 총괄 리더',
  isActive: true,
};
