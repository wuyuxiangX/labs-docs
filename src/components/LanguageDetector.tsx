'use client';

import { useEffect, useRef } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';

const COOKIE_NAME = 'preferred-lang';
const SUPPORTED_LANGS = ['zh', 'en'];

function setCookie(lang: string) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${COOKIE_NAME}=${lang}; path=/; expires=${expires.toUTCString()}`;
}

function getCookie(): string | undefined {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${COOKIE_NAME}=`))
    ?.split('=')[1];
}

export function LanguageDetector() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const currentLang = params.lang as string;

  useEffect(() => {
    const existingPref = getCookie();

    if (isFirstRender.current) {
      isFirstRender.current = false;

      if (!existingPref) {
        // 首次访问：检测系统语言
        const systemLang = navigator.language || navigator.languages?.[0] || 'en';
        const preferredLang = systemLang.startsWith('zh') ? 'zh' : 'en';

        // 保存偏好
        setCookie(preferredLang);

        // 如果当前语言与偏好不符，跳转
        if (currentLang !== preferredLang) {
          const newPath = pathname.replace(`/${currentLang}`, `/${preferredLang}`);
          router.replace(newPath);
        }
      }
    } else {
      // 非首次渲染：用户手动切换了语言，更新偏好
      if (SUPPORTED_LANGS.includes(currentLang) && existingPref !== currentLang) {
        setCookie(currentLang);
      }
    }
  }, [currentLang, pathname, router]);

  return null;
}
