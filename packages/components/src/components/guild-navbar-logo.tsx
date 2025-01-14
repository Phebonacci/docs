import { ReactElement } from 'react';
import clsx from 'clsx';
import { DocsThemeConfig } from 'nextra-theme-docs';
import { GuildLogo, TheGuild } from '../logos';
import { Anchor } from './anchor';

export function GuildUnifiedLogo({
  children,
  title,
  description,
}: {
  children: DocsThemeConfig['logo'];
  title: string;
  description: string;
}): ReactElement {
  return (
    <>
      <Anchor
        title="View our website"
        className={clsx(
          'flex items-center gap-x-1.5 transition-opacity hover:opacity-75',
          children && 'max-md:hidden',
        )}
        href="https://the-guild.dev"
      >
        <GuildLogo className="h-9 w-auto" />
        <TheGuild className="w-11" />
      </Anchor>
      {children && (
        <>
          <svg
            height="22"
            viewBox="0 0 10 22"
            stroke="currentColor"
            className="mx-6 shrink-0 max-md:hidden"
          >
            <path d="M8.6001 0.833313L0.600097 20.8333" />
          </svg>
          <Anchor
            title={title}
            className="flex shrink-0 items-center gap-x-1.5 hover:opacity-75"
            href="/"
          >
            {typeof children === 'function' ? children({}) : children}
            <div>
              <h1 className="text-sm font-bold leading-tight">{title}</h1>
              <h2 className="text-xs max-lg:hidden">{description}</h2>
            </div>
          </Anchor>
        </>
      )}
    </>
  );
}

/**
 * GraphQL-related products live under the Hive platform brand, so we use a single logo for them.
 * The rest gets The Guild / {Product} logo.
 */
export function getNavbarLogo(
  logo: DocsThemeConfig['logo'],
  websiteName: string,
  description: string,
) {
  return websiteName === 'Hive' ? (
    <Anchor title={websiteName} href="/">
      {typeof logo === 'function' ? logo({}) : logo}
    </Anchor>
  ) : (
    <GuildUnifiedLogo description={description} title={websiteName}>
      {logo}
    </GuildUnifiedLogo>
  );
}
