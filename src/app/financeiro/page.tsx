import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function FinanceiroPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Financeiro</h1>
      <Card>
        <CardHeader>
          <CardTitle>Módulo em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">Esta página de financeiro é um placeholder para futuras implementações.</p>
        </CardContent>
      </Card>
    </div>
  );
}
