import { Meta, Story } from '@storybook/react';
import Pagination, { PaginationProps } from './index';

export default {
  title: 'Components/Pagination',
  component: Pagination,
} as Meta<PaginationProps>;

const Template: Story = args => {
  return <Pagination setPage={undefined} {...args} />;
};

export const Base = Template.bind({});
Base.args = {
  total: 5,
  count: 10,
  onChange: page => console.log(page),
};

export const hasMore = Template.bind({});
hasMore.args = {
  total: 15,
  count: 10,
  onChange: page => console.log(page),
};
