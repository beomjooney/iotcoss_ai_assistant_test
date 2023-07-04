import 'public/assets/css/themify-icons.css';
import 'public/assets/css/bootstrap.min.css';
import 'public/assets/css/style.css';
import 'public/assets/css/responsive.css';

import React from 'react';
import { Meta, Story } from '@storybook/react';

import Navbar, { NavbarProps } from './index';

export default {
  title: 'Components/Header',
  component: Navbar,
} as Meta<NavbarProps>;

const Template: Story = args => {
  return <Navbar {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스',
};
