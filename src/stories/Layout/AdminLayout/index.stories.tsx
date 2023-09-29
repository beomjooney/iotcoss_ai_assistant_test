import React from 'react';
import { Meta, Story } from '@storybook/react';

import DefaultLayout, { DefaultLayoutProps } from './index';

export default {
  title: 'Layout/DefaultLayout',
  component: DefaultLayout,
} as Meta<DefaultLayoutProps>;

const Template: Story = args => {
  // eslint-disable-next-line react/no-children-prop
  return <DefaultLayout {...args} children="aaa" />;
};

export const Primary = Template.bind({});
Primary.args = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
