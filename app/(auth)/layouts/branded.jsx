import Link from 'next/link';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';

export function BrandedLayout({ children }) {
  return (
    <>
      <style>
        {`
          .branded-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/1.png')}');
          }
          .dark .branded-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/1-dark.png')}');
          }
        `}
      </style>
      <div className="grid lg:grid-cols-2 grow">
        <div className="flex justify-center items-center p-6 sm:p-8 lg:p-10 order-2 lg:order-1">
          <Card className="w-full max-w-[400px] drop-shadow-sm shadow-primary">
            <CardContent className="p-5 lg:p-6">{children}</CardContent>
          </Card>
        </div>

        <div className="bg-primary rounded-bl-[30px] rounded-tr-[30px] lg:rounded-bl-[100px] lg:rounded-tr-[100px] md:rounded-bl-[40px] md:rounded-tr-[40px] bg-top h-full bg-no-repeat">
          <div className="flex flex-col justify-center items-center h-full p-4 sm:p-8 lg:p-16 gap-4">
            <Link href="/">
              <img
                src={toAbsoluteUrl('/media/images/png/page-logo-1.png')}
                className="h-14 md:h-20 max-w-none"
                alt=""
              />
            </Link>

            <div className="flex flex-col gap-4">
              <h3 className="lg:text-4xl text-2xl md:text-3xl text-center text-destructive-foreground font-semibold">
                Welcome to Wiqi
              </h3>
              <div className="text-sm md:text-base text-center font-medium text-foreground">
                Securely access your personalized dashboard with Wiqi — {" "}
                <span className="text-destructive-foreground font-semibold">
                  smart, fast, and reliable
                </span>{" "}
                control for managing your workflow, data, and insights.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
