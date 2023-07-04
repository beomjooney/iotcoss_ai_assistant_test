import { Story, Meta } from '@storybook/react';
import Modal, { ModalProps } from '.';
import React, { useState } from 'react';

export default {
  component: Modal,
  title: 'Components/Modal',
} as Meta;

const Template: Story<ModalProps> = args => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>open modal</button>
      <Modal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)} {...args}>
        open!
      </Modal>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: '타이틀',
  label: '레이블',
  value: 'one',
  name: 'oki',
};
