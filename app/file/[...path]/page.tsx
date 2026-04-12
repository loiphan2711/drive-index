import { DriveIndexContent } from '@/components/ui/home/DriveIndexContent';

type FilePageProps = {
  params: Promise<{
    path: string[];
  }>;
};

export default async function FilePage({ params }: FilePageProps) {
  const { path } = await params;

  // path[0] is always '0' (root sentinel)
  // path[1] is the actual Google Drive folder ID (undefined at root)
  // path[2+] are human-readable display names for the breadcrumb
  const folderId = path[1] ?? null;

  return <DriveIndexContent folderId={folderId} pathSegments={path} />;
}
