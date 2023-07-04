import { MouseEvent } from 'react';
import { Meta, Story } from '@storybook/react';
import Chip, { ChipProps } from '.';

export default {
  component: Chip,
  title: 'components/Chip',
  decorators: [Story => <div style={{ padding: '20px' }}>{Story()}</div>],
} as Meta;

const Template: Story<ChipProps> = ({ children, chipColor, ...props }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      {['primary', 'gray', 'black', 'plan', 'design', 'develop', 'engineering'].map((v, i) => (
        <div key={`chip${i}`}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'baseline',
              padding: '5px',
            }}
          >
            <span style={{ marginBottom: '8px' }}>{v}</span>
            <Chip {...props} chipColor={v}>
              {children}
            </Chip>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'baseline',
              padding: '5px',
              backgroundColor: '#E8E8E8',
            }}
          >
            <span style={{ marginBottom: '8px' }}>{v}</span>
            <Chip {...props} chipColor={v} key={`chip${i}`}>
              {children}
            </Chip>
          </div>
        </div>
      ))}
    </div>
  );
};

export const Filled = Template.bind({});
Filled.args = {
  variant: 'filled',
  children: 'Chip',
};
Filled.parameters = { controls: { exclude: ['onClick', 'href', 'target'] } };

export const Outlined = Template.bind({});
Outlined.args = {
  variant: 'outlined',
  children: 'Chip',
  radius: 4,
};
Outlined.parameters = { ...Filled.parameters };

export const CustomRadius = Template.bind({});
CustomRadius.args = {
  ...Outlined.args,
  radius: 15,
};
CustomRadius.parameters = { ...Filled.parameters };

export const Clickable = Template.bind({});
Clickable.args = {
  ...Outlined.args,
  onClick: (e: MouseEvent<HTMLButtonElement>) => alert('test ' + e.currentTarget.dataset['test']),
};
Clickable.parameters = { controls: { exclude: ['href', 'target'] } };

export const LinkRole = Template.bind({});
LinkRole.args = {
  children: 'as a link',
  href: '/',
  target: '_blank',
};
LinkRole.parameters = { controls: { exclude: ['onClick'] } };
