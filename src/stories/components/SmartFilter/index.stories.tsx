import '../../../../public/assets/css/admin/style.css';
import { Meta, Story } from '@storybook/react';

import SmartFilter from './index';
import React from 'react';

export default {
  title: 'Components/SmartFilter',
  component: SmartFilter,
} as Meta;

const FIELDS = [
  { name: 'UUID', field: 'UUID', type: 'text' },
  { name: '회원아이디', field: 'MEMBER_ID', type: 'text' },
  { name: '회원고유번호', field: 'MEMBER_URI', type: 'text' },
  { name: '회원명', field: 'NAME', type: 'text' },
  { name: '닉네임', field: 'NICKNAME', type: 'text' },
  { name: '이메일', field: 'EMAIL', type: 'text' },
];

const Template: Story = args => {
  return <SmartFilter name={''} fields={FIELDS} {...args} />;
};

const handleClick = () => {
  alert('클릭 이벤트');
};

export const Default = Template.bind({});
Default.args = {
  name: 'test',
  isFilterOpen: true,
  fields: FIELDS,
};
