import Link from 'next/link';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const content = {
    zh: {
      title: 'SecondMe API 开发者文档',
      description: '查看',
      link: '文档',
      suffix: '开始集成 SecondMe API。',
    },
    en: {
      title: 'SecondMe API Developer Docs',
      description: 'View the',
      link: 'documentation',
      suffix: 'to start integrating SecondMe API.',
    },
  };

  const t = content[lang as keyof typeof content] || content.zh;

  return (
    <div className="flex flex-col justify-center text-center flex-1">
      <h1 className="text-2xl font-bold mb-4">{t.title}</h1>
      <p>
        {t.description}{' '}
        <Link href={`/${lang}/docs`} className="font-medium underline">
          {t.link}
        </Link>{' '}
        {t.suffix}
      </p>
    </div>
  );
}
