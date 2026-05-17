import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  Package,
  DollarSign,
  ArrowRight,
  History,
  ClipboardList,
  Layers,
  Timer,
  Banknote
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  // Fetch real data from database
  const allPecas = await prisma.peca.findMany({
    include: { tipo: true }
  });

  const despesas = await prisma.despesa.findMany();

  const solicitacoesPendentes = await prisma.solicitacaoCompra.count({
    where: { status: "PENDENTE" }
  });

  // Business logic for status
  const hoje = new Date();

  const pecasEmCura = allPecas.filter(p => {
    const dataCura = new Date(p.dataProducao);
    dataCura.setDate(dataCura.getDate() + p.tipo.tempoCuraPadrao);
    return hoje < dataCura;
  });

  const pecasAptas = allPecas.filter(p => {
    const dataCura = new Date(p.dataProducao);
    dataCura.setDate(dataCura.getDate() + p.tipo.tempoCuraPadrao);
    return hoje >= dataCura;
  });

  const receitaMensal = 0; // Placeholder for sales module
  const saidasMensal = despesas
    .filter(d => d.createdAt.getMonth() === hoje.getMonth())
    .reduce((acc, curr) => acc + curr.valor, 0);

  const saidasAnual = despesas
    .filter(d => d.createdAt.getFullYear() === hoje.getFullYear())
    .reduce((acc, curr) => acc + curr.valor, 0);

  const recentMovements = allPecas.slice(0, 5).map(p => ({
    item: p.tipo.nome,
    qty: "1 un",
    date: p.dataProducao.toLocaleDateString(),
    color: "text-emerald-500"
  }));

  return (
    <div className="p-8 space-y-8 bg-[#0b0f1a] min-h-screen text-slate-200">
      {/* Header Info */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Geral</h1>
          <p className="text-slate-400 mt-1 font-medium">Visão consolidada da operação industrial</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#161e31] border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-300">Turno A em operação</span>
          </div>
        </div>
      </div>

      <main className="space-y-8">
        {/* Main Operational Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-800/50 bg-[#161e31]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Solicitações Pendentes</span>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <ClipboardList className="w-5 h-5 text-blue-500/80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white mb-1">{solicitacoesPendentes}</div>
              <p className="text-xs text-slate-500 font-medium">Aguardando cotação em suprimentos</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-[#161e31]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Peças em Cura</span>
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Timer className="w-5 h-5 text-orange-500/80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white mb-1">{pecasEmCura.length}</div>
              <p className="text-xs text-slate-500 font-medium">Processo de secagem ativa</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-[#161e31]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Aptas a Retirar</span>
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-500/80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white mb-1">{pecasAptas.length}</div>
              <p className="text-xs text-slate-500 font-medium">Logística liberada</p>
            </CardContent>
          </Card>
        </div>

        {/* Financial Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-800/50 bg-[#161e31]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Receita (Estimada)</span>
              <Banknote className="w-5 h-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">R$ {receitaMensal.toLocaleString()}</div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-emerald-500 text-xs font-bold">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +0.0%
                </div>
                <span className="text-xs text-slate-500">Módulo de vendas pendente</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-[#161e31]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Saídas (Total Suprimentos)</span>
              <TrendingDown className="w-5 h-5 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">R$ {saidasMensal.toLocaleString()}</div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-rose-500 text-xs font-bold">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  Mês Atual
                </div>
              </div>
              <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-tight">Acumulado Anual:</span>
                <span className="text-sm font-bold text-slate-200">R$ {saidasAnual.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Movements */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <History className="w-4 h-4" />
            Produção Recente
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {recentMovements.length > 0 ? recentMovements.map((m, idx) => (
              <Card key={idx} className="border-slate-800/50 bg-[#161e31] p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-slate-200 truncate">{m.item}</span>
                    <span className={cn("text-sm font-black", m.color)}>{m.qty}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{m.date}</span>
                </div>
              </Card>
            )) : (
              <div className="col-span-5 text-center py-8 text-slate-600 text-sm italic">Nenhuma produção registrada.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
