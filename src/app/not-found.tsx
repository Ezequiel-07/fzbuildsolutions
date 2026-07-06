import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold">404 - Not Found</h2>
      <p className="text-muted-foreground">Could not find requested resource</p>
      <Link
        href="/"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        Return Home
      </Link>
    </div>
  );
}
