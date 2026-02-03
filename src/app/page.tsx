import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const cookieStore = await cookies();
  const preferredLang = cookieStore.get('preferred-lang')?.value;

  if (preferredLang && ['zh', 'en'].includes(preferredLang)) {
    redirect(`/${preferredLang}/docs`);
  }

  // 无偏好，尝试从 Accept-Language 检测
  const headersList = await headers();
  const acceptLang = headersList.get('accept-language') || '';
  const detectedLang = acceptLang.toLowerCase().includes('zh') ? 'zh' : 'en';

  redirect(`/${detectedLang}/docs`);
}
