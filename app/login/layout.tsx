export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6rem] top-1/4 h-64 w-64 rounded-full bg-[#7107e7]/18 blur-3xl" />
        <div className="absolute right-[-8rem] top-[-4rem] h-72 w-72 rounded-full bg-[#1c202b]/14 blur-3xl dark:bg-[#dfe7ff]/10" />
        <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-[#3f6cff]/12 blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </main>
  );
}
