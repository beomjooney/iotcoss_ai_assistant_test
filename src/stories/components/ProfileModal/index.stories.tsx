import { Story, Meta } from '@storybook/react';
import ProfileModal, { ProfileModalProps } from '.';

export default {
  component: ProfileModal,
  title: 'Components/ProfileModal',
} as Meta;

const Template: Story<ProfileModalProps> = args => {
  return <ProfileModal {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  label: '레이블',
  value: 'one',
  name: 'oki',
};
