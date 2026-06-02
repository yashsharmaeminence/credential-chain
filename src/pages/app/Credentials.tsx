import CredentialList from "@/components/CredentialList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Credentials() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Credentials</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verifiable reviewer credentials held by your wallet.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">My wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <CredentialList />
        </CardContent>
      </Card>
    </div>
  );
}

