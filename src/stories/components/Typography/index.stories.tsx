import { Story, Meta } from '@storybook/react';
import Typography, { TypographyProps } from '.';

export default {
  component: Typography,
  title: 'Components/Typography',
  argTypes: {},
} as Meta;

const Template: Story<TypographyProps> = ({ ...args }) => {
  return <Typography {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  children: 'Typography',
  type: 'H1',
};

export const extendClass = Template.bind({});
extendClass.args = {
  children: 'Typography',
  extendClass: 'text--override',
};
