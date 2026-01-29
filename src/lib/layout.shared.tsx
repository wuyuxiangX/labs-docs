import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(lang: string = 'zh'): BaseLayoutProps {
  const navTitle = {
    zh: 'SecondMe API',
    en: 'SecondMe API',
  };

  const llmLabel = {
    zh: 'LLM 端点',
    en: 'LLM Endpoints',
  };

  return {
    nav: {
      title: navTitle[lang as keyof typeof navTitle] || navTitle.zh,
    },
    i18n: true,
    links: [
      {
        text: llmLabel[lang as keyof typeof llmLabel] || llmLabel.zh,
        url: `/${lang}/llms.txt`,
      },
    ],
  };
}
