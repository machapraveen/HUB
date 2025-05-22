
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSpace } from "@/contexts/SpaceContext";
import { LockKeyhole } from "lucide-react";

export function SecurityCodeVerification() {
  const [securityCode, setSecurityCode] = useState("");
  const [error, setError] = useState("");
  const { verifySecurityCode, userSpace } = useSpace();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation - this would be more robust in a real application
    if (securityCode.trim() === "") {
      setError("Security code is required");
      return;
    }
    
    const verified = verifySecurityCode(securityCode);
    
    if (!verified) {
      setError("Invalid security code");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <div className="bg-primary/10 p-3 rounded-full mb-2">
            <LockKeyhole className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Security Verification</CardTitle>
          <CardDescription>
            Enter the security code to access {userSpace}'s personal space
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="securityCode"
                placeholder="Enter security code"
                type="password"
                value={securityCode}
                onChange={(e) => {
                  setSecurityCode(e.target.value);
                  if (error) setError("");
                }}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <Button type="submit" className="w-full">Verify</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <p className="text-sm text-muted-foreground">
            This is a security measure to protect private data.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
