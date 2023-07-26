import { Story, Meta } from '@storybook/react';
import ToggleButton, { ToggleProps } from '.';
// import Icon from '../Icon';

export default {
  component: ToggleButton,
  title: 'Components/ToggleButton',
} as Meta;

const Template: Story<ToggleProps> = args => {
  return (
    <>
      <div style={{ display: 'inline-block' }}>
        <ToggleButton {...args} />
      </div>
      <div style={{ display: 'inline-block' }}>
        <ToggleButton {...args} />
      </div>
    </>
  );
};

const TemplateIcon: Story<ToggleProps> = args => {
  return (
    <>
      <div style={{ display: 'inline-block' }}>
        <ToggleButton {...args} />
      </div>
      <div style={{ display: 'inline-block' }}>
        <ToggleButton {...args} />
      </div>
    </>
  );
};

const TemplateMulti: Story<ToggleProps> = args => {
  const width = '6rem';
  return (
    <div style={{ display: 'flex', gap: '0.5rem', width: '20rem', flexWrap: 'wrap' }}>
      <div style={{ width, display: 'inline-block' }}>
        <ToggleButton {...args} />
      </div>
      <div style={{ width, display: 'inline-block' }}>
        <ToggleButton {...args} />
      </div>
      <div style={{ width, display: 'inline-block' }}>
        <ToggleButton {...args} disabled />
      </div>
      <div style={{ width, display: 'inline-block' }}>
        <ToggleButton {...args} />
      </div>
      <div style={{ width, display: 'inline-block' }}>
        <ToggleButton {...args} />
      </div>
      <div style={{ width, display: 'inline-block' }}>
        <ToggleButton {...args} />
      </div>
    </div>
  );
};

const TemplateCheckBox: Story<ToggleProps> = args => {
  const width = '6rem';
  return (
    <div style={{ display: 'flex', gap: '0.5rem', width: '20rem', flexWrap: 'wrap' }}>
      <div style={{ width, display: 'inline-block' }}>
        <ToggleButton {...args} />
      </div>
      <div style={{ width, display: 'inline-block' }}>
        <ToggleButton {...args} />
      </div>
      <div style={{ width, display: 'inline-block' }}>
        <ToggleButton {...args} disabled />
      </div>
      <div style={{ width, display: 'inline-block' }}>
        <ToggleButton {...args} />
      </div>
      <div style={{ width, display: 'inline-block' }}>
        <ToggleButton {...args} />
      </div>
      <div style={{ width, display: 'inline-block' }}>
        <ToggleButton {...args} />
      </div>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: '레이블',
  value: 'one',
  name: 'oki',
};

export const Large = Template.bind({});
Large.args = {
  label: '레이블',
  value: 'one',
  name: 'oki',
  variant: 'large',
};

export const Medium = TemplateIcon.bind({});
Medium.args = {
  label: '레이블',
  value: 'one',
  name: 'oki',
  variant: 'medium',
};

export const Multiple = TemplateMulti.bind({});
Multiple.args = {
  label: '레이블',
  value: 'one',
  name: 'oki',
  type: 'multiple',
};

export const Active = Template.bind({});
Active.args = {
  label: '레이블',
  value: 'one',
  name: 'oki',
  type: 'small',
  isActive: true,
};

export const CheckBox = TemplateCheckBox.bind({});
CheckBox.args = {
  label: '체크박스',
  value: 'one',
  name: 'oki',
  type: 'checkBox',
  isActive: true,
};
