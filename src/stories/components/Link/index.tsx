import NextLink from 'next/link';
import { ReactNode, AnchorHTMLAttributes, useMemo } from 'react';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 링크 href */
  href: string;
  children: ReactNode;
  className?: string;
  isAbsolute?: boolean | 'business' | 'personal' | 'alba-talk';
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
}

export function Link({ href, children, isAbsolute, ...props }: LinkProps) {
  const url = useMemo(
    () =>
      (isAbsolute
        ? `${process.env['NEXT_PUBLIC_SERVICES_HTTPS_URL']}${
            typeof isAbsolute === 'string' ? `/${isAbsolute}` : ''
          }${href}`
        : href) || '#',
    [isAbsolute, href],
  );

  return (
    <NextLink href={url}>
      <a {...props} rel={props.target === '_blank' ? 'noopener nofollow noindex noreferrer' : undefined}>
        {children}
      </a>
    </NextLink>
  );
}

export default Link;
