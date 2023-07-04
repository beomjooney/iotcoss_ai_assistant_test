import { Story, Meta } from '@storybook/react';
import Loading from '.';
import React, { useState } from 'react';

export default {
  component: Loading,
  title: 'Components/Modal',
} as Meta;

const Template: Story = args => {
  return (
    <>
      <Loading />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
