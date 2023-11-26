import '../../../../public/assets/css/themify-icons.css';
import '../../../../public/assets/css/bootstrap.min.css';
import '../../../../public/assets/css/admin/style.css';
import '../../../../public/assets/css/responsive.css';

import React from 'react';
import { Meta, Story } from '@storybook/react';

import Navbar from './index';

export default {
  title: 'Components/Header',
  component: Navbar,
} as Meta;

const Template: Story = args => {
  return <Navbar {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
