import { Story, Meta } from '@storybook/react';
import ResumeStory, { ResumeStoryProps } from '.';

export default {
  component: ResumeStory,
  title: 'Components/ResumeStory',
  argTypes: {},
} as Meta;

const Template: Story<ResumeStoryProps> = ({ ...args }) => {
  return <ResumeStory {...args} />;
};

export const Default = Template.bind({});
Default.args = {};
