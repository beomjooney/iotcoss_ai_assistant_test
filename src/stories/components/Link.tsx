import React, { FC } from 'react';
import { Link as RrdLink, LinkProps } from 'react-router-dom';

interface Props extends Omit<LinkProps, 'to'> {
  href: LinkProps['to'];
}

const Link: FC<Props> = ({ href, ...args }) => {
  return <RrdLink {...args} to={href} />;
};

export default Link;
