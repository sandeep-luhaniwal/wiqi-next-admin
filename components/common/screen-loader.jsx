'use client';

import { toAbsoluteUrl } from '@/lib/helpers';
import Image from 'next/image';

export function ScreenLoader() {
  return (
    <div className="flex flex-col items-center gap-2 justify-center fixed inset-0 z-50 transition-opacity duration-700 ease-in-out">
      <Image
        className="w-24 h-auto max-w-none"
        src='/media/images/png/page-logo.png'
        alt="logo"
        width={124}
        height={120}
      />
      <div className="text-muted-foreground font-medium text-sm">
        Loading...
      </div>
    </div>
  );
}
