import type { ReactNode } from 'react';
import { i18n } from '@/lib/i18n';
import { RootProvider } from 'fumadocs-ui/provider/next';

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <RootProvider
      i18n={{
        locale: lang,
        locales: i18n.languages.map((l) => ({
          locale: l,
          name: l === 'zh' ? '🇨🇳 中文' : '🇬🇧 English',
        })),
      }}
    >
      <div lang={lang} dir="ltr">
        {children}
      </div>
    </RootProvider>
  );
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}
