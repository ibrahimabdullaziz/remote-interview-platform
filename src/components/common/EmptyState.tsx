import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  image?: React.ReactNode;
  icon?: LucideIcon;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  image,
  icon: Icon,
  actionLabel,
  actionLink,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="flex items-center justify-center w-20 h-20 bg-muted/30 rounded-full mb-6 relative">
        {image ? (
          image
        ) : Icon ? (
          <Icon className="w-10 h-10 text-muted-foreground" />
        ) : null}
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>

      {actionLabel && (actionLink || onAction) && (
        <>
          {actionLink ? (
            <Link href={actionLink}>
              <Button size="lg">{actionLabel}</Button>
            </Link>
          ) : (
            <Button size="lg" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
