import 'public/assets/css/themify-icons.css';
import 'public/assets/css/bootstrap.min.css';
import 'public/assets/css/style.css';
import 'public/assets/css/responsive.css';

import { Meta, Story } from '@storybook/react';

import Footer from './index';

export default {
  title: 'Components/Footer',
  component: Footer,
} as Meta;

const Template: Story = args => {
  return <Footer {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
