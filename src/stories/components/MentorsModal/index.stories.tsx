import { Story, Meta } from '@storybook/react';
import MentorsModal, { MentorsModalProps } from '.';

export default {
  component: MentorsModal,
  title: 'Components/MentorsModal',
} as Meta;

const Template: Story<MentorsModalProps> = args => {
  return <MentorsModal {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  label: '레이블',
  value: 'one',
  name: 'oki',
};
