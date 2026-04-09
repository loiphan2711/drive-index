import { Card, cn } from '@heroui/react';

export const LoginPageFallback = () => (
  <Card
    className={cn(
      'auth-panel relative overflow-hidden rounded-none border-2 border-foreground bg-background',
    )}
  >
    <div className="absolute inset-x-0 top-0 h-1 bg-primary" />

    <Card.Header className="pb-3 pt-5">
      <div className="flex items-center gap-3">
        <div className="size-9 animate-pulse rounded-none bg-foreground/10" />
        <div className="space-y-2">
          <div className="h-6 w-28 animate-pulse rounded-none bg-foreground/10" />
          <div className="h-3 w-44 animate-pulse rounded-none bg-foreground/8" />
        </div>
      </div>
    </Card.Header>

    <Card.Content className="space-y-4 pb-5 pt-0">
      <div className="space-y-2">
        <div className="h-3 w-20 animate-pulse rounded-none bg-foreground/8" />
        <div className="h-11 w-full animate-pulse rounded-none bg-foreground/10" />
      </div>
      <div className="h-12 w-full animate-pulse rounded-none bg-foreground/8" />
    </Card.Content>
  </Card>
);
