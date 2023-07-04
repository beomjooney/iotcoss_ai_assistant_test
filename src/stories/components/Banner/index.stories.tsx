import React from 'react';
import { Meta, Story } from '@storybook/react';

import Banner, { BannerProps } from './index';

export default {
  title: 'Components/PageBanner',
  component: Banner,
} as Meta<BannerProps>;

const Template: Story = args => {
  return <Banner title="페이지 제목" {...args} />;
};

export const Default = Template.bind({});
