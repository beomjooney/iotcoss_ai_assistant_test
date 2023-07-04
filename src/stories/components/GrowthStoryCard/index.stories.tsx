import { Story, Meta } from '@storybook/react';
import GrowthStoryCard, { GrowthStoryCardProps } from '.';

export default {
  component: GrowthStoryCard,
  title: 'components/GrowthStoryCard',
} as Meta;

const Template: Story<GrowthStoryCardProps> = args => {
  return (
    <div className="row col-md-12" style={{ display: 'flex', gap: 10 }}>
      <div className="single-promo single-promo-hover single-promo-1 rounded text-center white-bg p-5 h-100">
        <GrowthStoryCard
          title="제 1장"
          subTitle="첫 번째 도전"
          isGray={false}
          message="첫번째 도전 스토리를 입력해 주세요."
          {...args}
        />
      </div>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  isGray: false,
};

export const Gray = Template.bind({});
Gray.args = {
  isGray: true,
};
