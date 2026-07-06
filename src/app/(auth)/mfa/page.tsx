import { MFAForm } from "@/features/auth/components/mfa-form";

export default function MFAPage() {
  return (
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Security Verification
      </h1>
      <p className="text-sm text-muted-foreground">
        Protecting your FZ OS account
      </p>
      <div className="mt-4 text-left">
        <MFAForm />
      </div>
    </div>
  );
}
