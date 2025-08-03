"use client";
import React from "react";

export function GlobalErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(event.error || new Error("An unexpected error occurred."));
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen text-center p-8"
        role="alert"
        aria-live="assertive"
      >
        <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          {error.message ||
            "An unexpected error occurred. Please try again later."}
        </p>
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
