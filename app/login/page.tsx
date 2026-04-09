import { Suspense } from 'react';

import { LoginPageContent } from '@/components/ui/login';
import { LoginPageFallback } from '@/components/ui/login/LoginFallback';

const LoginPage = () => (
  <Suspense fallback={<LoginPageFallback />}>
    <LoginPageContent />
  </Suspense>
);

export default LoginPage;
