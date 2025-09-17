'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  LoaderCircleIcon,
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { apiFetch } from '@/lib/api';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// ----- Add the schema (inline) -----
const getSigninSchema = () =>
  z.object({
    email: z.string().email({ message: 'Enter a valid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  });

export default function Page() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  // added missing `success` state used later in the component
  const [success, setSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(getSigninSchema()),
    defaultValues: {
      email: 'wiqiadmin@gmail.com',
      password: 'wiqiadmin@gmail.com',
    },
  });

  const onSubmit = async (values) => {
    setIsProcessing(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (res?.error) {
        setError(res.error);
        return;
      }

      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();

      if (session?.user?.token) {
        localStorage.setItem('token', session.user.token); // save API token
      }

      router.push('/');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <Alert onClose={() => setSuccess(false)}>
        <AlertIcon>
          <Check />
        </AlertIcon>
        <AlertTitle>
          You have successfully signed up! Please check your email to verify
          your account and then{' '}
          <Link
            href="/signin/"
            className="text-primary hover:text-primary-darker"
          >
            Log in
          </Link>
          .
        </AlertTitle>
      </Alert>
    );
  }

  return (
    <Suspense>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto mt-2 md:mt-8 lg:mt-10">
          <h2 className="text-xl font-bold text-center">Login to WiQi Life</h2>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <Input
                    {...field}
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="Enter password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute hover:bg-transparent hover:text-primary top-1/2 right-2 -translate-y-1/2"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isProcessing} className="w-full">
            {isProcessing ? (
              <>
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin inline-block" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </Form>
    </Suspense>
  );
}
