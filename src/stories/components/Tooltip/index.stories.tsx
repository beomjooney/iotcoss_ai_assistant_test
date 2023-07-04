import { Story, Meta } from '@storybook/react';
import Tooltip, { TooltipProps } from '.';

export default {
  component: Tooltip,
  title: 'components/Tooltip',
  parameters: {
    docs: {
      description: {
        component: '',
      },
    },
  },
  argTypes: {
    placement: {
      options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end'],
      control: {
        type: 'radio',
      },
    },
    trigger: {
      options: ['click', 'mouseEnter'],
      control: {
        type: 'radio',
      },
    },
    variant: {
      options: ['box', 'bubble'],
      control: {
        type: 'radio',
      },
    },
  },
  decorators: [
    Story => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '100px', flexWrap: 'wrap' }}>
        {Story()}
      </div>
    ),
  ],
} as Meta;

const List: Story<TooltipProps> = ({ content, translateXY, ...props }) => {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <Tooltip key={`tooltip${i}`} content={content} translateXY={translateXY} {...props}>
          <button>툴팁</button>
        </Tooltip>
      ))}
    </>
  );
};

export const ClickTrigger = List.bind({});
ClickTrigger.args = {
  content: '한글입력하기 한글입력하기 한글입력하기 한글입력하기 한글입력하기 한글입력하기',
  trigger: 'click',
  placement: 'bottom',
};

export const MouseEnterTrigger = List.bind({});
MouseEnterTrigger.args = {
  content: 'click!',
  trigger: 'mouseEnter',
};

export const TooltipBox = List.bind({});
TooltipBox.args = {
  content: 'click!',
  trigger: 'mouseEnter',
  variant: 'box',
};
