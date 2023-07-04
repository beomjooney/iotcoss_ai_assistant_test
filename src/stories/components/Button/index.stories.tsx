import React from 'react';
import { Meta, Story } from '@storybook/react';

import Button, { ButtonProps } from './index';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<ButtonProps>;

const Template: Story = ({ children, ...args }) => {
  return <Button {...args}>{children}</Button>;
};

export const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
  label: '버튼',
};

export const Gray = Template.bind({});
Gray.args = {
  color: 'gray',
  label: '버튼',
};

export const Secondary = Template.bind({});
Secondary.args = {
  color: 'secondary',
  label: '버튼',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: '버튼',
};

export const Medium = Template.bind({});
Medium.args = {
  size: 'medium',
  label: '버튼',
};
