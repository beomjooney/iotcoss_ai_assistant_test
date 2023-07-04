import styles from './index.module.scss';
import classNames from 'classnames/bind';
import YouTube, { YouTubeProps } from 'react-youtube';
import { useVideoPlay } from '../../../hooks/useVideoPlay';

export interface PlayerYoutubeProps extends YouTubeProps {
  /** video id */
  videoId: string;
  className?: string;
  host?: string;
}

const cx = classNames.bind(styles);

export function PlayerYoutube({ opts, className = 'player-youtube', ...props }: PlayerYoutubeProps) {
  const { handleVideoPlay }: any = useVideoPlay;
  const defaultOpts = {
    playerVars: {
      autoplay: 0,
      controls: 0,
      autohide: 1,
      wmode: 'opaque',
      origin: 'http://localhost:3001',
      // host: 'https://www.youtube.com/embed',
    },
  };
  const youtubeOpts = Object.assign(defaultOpts, opts);

  return (
    <div className={cx(className)}>
      <YouTube {...props} opts={youtubeOpts} />
    </div>
  );
}

export default PlayerYoutube;
