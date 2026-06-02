import ReviewActivity from "@/components/ReviewActivity";

export default function Reviews() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Anonymous verified reviews submitted to the on-chain record.
        </p>
      </div>
      <ReviewActivity />
    </div>
  );
}

