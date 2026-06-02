import ManuscriptGrid from "@/components/ManuscriptGrid";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Manuscripts() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manuscripts</h1>
          <p className="text-sm text-muted-foreground mt-1">Registered manuscripts and their review status.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/app/overview">Back to overview</Link>
        </Button>
      </div>
      <ManuscriptGrid />
    </div>
  );
}

