import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Componente Skeleton simples
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className || ''}`}
      {...props}
    />
  );
}

interface LoadingCardProps {
  title?: string;
  showImage?: boolean;
  showDescription?: boolean;
  showButton?: boolean;
}

export function LoadingCard({ 
  title = "Carregando...", 
  showImage = true, 
  showDescription = true, 
  showButton = true 
}: LoadingCardProps) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        {showDescription && <Skeleton className="h-3 w-full" />}
      </CardHeader>
      <CardContent className="space-y-4">
        {showImage && (
          <Skeleton className="h-48 w-full rounded-md" />
        )}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        {showButton && (
          <Skeleton className="h-10 w-full" />
        )}
      </CardContent>
    </Card>
  );
}

// Card de carregamento simples com spinner
export function LoadingCardSpinner({ title = "Carregando..." }: { title?: string }) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <h3 className="text-lg font-semibold text-center">{title}</h3>
      </CardHeader>
      <CardContent className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </CardContent>
    </Card>
  );
}

export function ProductLoadingCard() {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardContent className="space-y-4 pt-4">
        <Skeleton className="h-48 w-full rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}
