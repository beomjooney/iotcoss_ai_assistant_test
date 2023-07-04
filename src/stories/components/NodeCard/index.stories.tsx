import { Story, Meta } from '@storybook/react';
import NodeCard, { NodeCardProps } from '.';

export default {
  component: NodeCard,
  title: 'Components/NodeCard',
} as Meta;

const Template: Story<NodeCardProps> = args => {
  return <NodeCard index={0} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  label: '레이블',
  value: 'one',
  name: 'oki',
};
