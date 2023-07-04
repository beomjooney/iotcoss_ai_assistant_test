import 'public/assets/css/admin/style.css';
import { Meta, Story } from '@storybook/react';

import Table from './index';
import React from 'react';

export default {
  title: 'Components/Table',
  component: Table,
} as Meta;

const Template: Story = args => {
  return (
    <Table
      name={''}
      colgroup={[]}
      heads={[]}
      items={
        <tr>
          <td>aaaa</td>
          <td>bbbb</td>
          <td>cccc</td>
          <td>dddd</td>
          <td>eeee</td>
        </tr>
      }
      {...args}
    />
  );
};

const handleClick = () => {
  alert('클릭 이벤트');
};

export const Default = Template.bind({});
Default.args = {
  name: 'test',
  colgroup: [8, 8, 8, 8, 8],
  heads: ['회원아이디', '회원명', '닉네임', '이메일', '연령대'],
  items: (
    <>
      <tr onClick={handleClick}>
        <td>aaaa</td>
        <td>bbbb</td>
        <td>cccc</td>
        <td>dddd</td>
        <td>eeee</td>
      </tr>
      <tr onClick={handleClick}>
        <td>aaaa</td>
        <td>bbbb</td>
        <td>cccc</td>
        <td>dddd</td>
        <td>eeee</td>
      </tr>
      <tr onClick={handleClick}>
        <td>aaaa</td>
        <td>bbbb</td>
        <td>cccc</td>
        <td>dddd</td>
        <td>eeee</td>
      </tr>
      <tr onClick={handleClick}>
        <td>aaaa</td>
        <td>bbbb</td>
        <td>cccc</td>
        <td>dddd</td>
        <td>eeee</td>
      </tr>
      <tr onClick={handleClick}>
        <td>aaaa</td>
        <td>bbbb</td>
        <td>cccc</td>
        <td>dddd</td>
        <td>eeee</td>
      </tr>
    </>
  ),
};
