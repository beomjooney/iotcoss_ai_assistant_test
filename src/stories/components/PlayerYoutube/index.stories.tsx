import { Story, Meta } from '@storybook/react';
import PlayerYoutube, { PlayerYoutubeProps } from '.';

export default {
  component: PlayerYoutube,
  title: 'Components/PlayerYoutube',
  parameters: {
    componentSubtitle: '유투브 동영상 플레이어',
    docs: {
      description: {
        component:
          '> 여러개의 동영상이 있을경우 동시재생 방지 `libs/shared/hooks/src/lib/useVideoPlay.ts`의 `handleVideoPlay`을 onPlay 콜백으로 사용<br /> ' +
          'dependencies : react-youtube( youtube 공식 ) <br />' +
          '관련 props는 `https://www.npmjs.com/package/react-youtube` 참조',
      },
    },
  },
} as Meta;

const Template: Story<PlayerYoutubeProps> = args => {
  return <PlayerYoutube {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  videoId: 'JAHwbhES0EI',
};
