import StatsTiles from "@/components/StatsTiles";
import ReviewActivity from "@/components/ReviewActivity";
import ManuscriptGrid from "@/components/ManuscriptGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NetworkStrip from "@/components/NetworkStrip";

export default function Overview() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Protocol Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enterprise-grade peer review infrastructure with verifiable credentials and privacy-preserving anonymity.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-semibold">Network & Provenance</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <NetworkStrip />
        </CardContent>
      </Card>

      <StatsTiles />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReviewActivity />
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Manuscripts (snapshot)</CardTitle>
          </CardHeader>
          <CardContent>
            <ManuscriptGrid />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

