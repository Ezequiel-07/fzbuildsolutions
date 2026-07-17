export default function OfflinePage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-6 p-8">
      <div className="rounded-full bg-primary/10 p-6">
        <svg
          className="h-16 w-16 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.364 5.636a9 9 0 0 1 0 12.728m-2.829-2.829a5 5 0 0 0 0-7.07m-4.243 4.243a1 1 0 0 1 0-1.414.7.7 0 0 1 .707-.707.7.7 0 0 1 .707.707 1 1 0 0 1 0 1.414.7.7 0 0 1-.707.707.7.7 0 0 1-.707-.707Z"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-center">
        Você está offline
      </h1>
      <p className="text-muted-foreground text-center max-w-md">
        Conecte-se à internet para acessar o conteúdo completo. 
        Alguns dados podem estar disponíveis em cache.
      </p>
    </div>
  );
}