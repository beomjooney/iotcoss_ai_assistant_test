import { Story, Meta } from '@storybook/react';
import SectionHeader, { SectionHeaderProps } from '.';

export default {
  component: SectionHeader,
  title: 'Components/SectionHeader',
  argTypes: {},
} as Meta;

const Template: Story<SectionHeaderProps> = ({ ...args }) => {
  return <SectionHeader title="제목" subTitle="부 제목" {...args} />;
};

export const Large = Template.bind({});

export const Small = Template.bind({});
Small.args = {
  size: 'small',
};
