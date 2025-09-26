'use client';

import Link from 'next/link';
import { ChevronFirst } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function SidebarHeader() {
  const { settings, storeOption } = useSettings();

  const handleToggleClick = () => {
    storeOption(
      'layouts.demo1.sidebarCollapse',
      !settings.layouts.demo1.sidebarCollapse,
    );
  };

  return (
    <div className="sidebar-header hidden lg:flex items-center relative justify-between px-3 lg:px-6 shrink-0">
      <Link href="/">
        <div className="dark:hidden">

          <Image
            width={40}
            className="default-logo h-[32px] max-w-none"
            height={40} src={'/media/images/png/page-logo.png'}
            alt='pageplod'
          />

          <Image
            className="small-logo h-[32px] max-w-none"
            width={40} height={40}
            src={'/media/images/png/page-logo.png'}
            alt='pageplod' />


        </div>
        <div className="hidden dark:block">
          <Image
            width={40}
            className="default-logo h-[32px] max-w-none"
            height={40} src={'/media/images/png/page-logo.png'}
            alt='pageplod'
          />

          <Image
            className="small-logo h-[32px] max-w-none"
            width={40} height={40}
            src={'/media/images/png/page-logo.png'}
            alt='pageplod' />
        </div>
      </Link>
      <Button
        onClick={handleToggleClick}
        size="sm"
        mode="icon"
        variant="outline"
        className={cn(
          'size-7 absolute start-full top-2/4 rtl:translate-x-2/4 -translate-x-2/4 -translate-y-2/4',
          settings.layouts.demo1.sidebarCollapse
            ? 'ltr:rotate-180'
            : 'rtl:rotate-180',
        )}
      >
        <ChevronFirst className="size-4!" />
      </Button>
    </div>
  );
}
