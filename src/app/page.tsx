"use client";

import React, { useState } from "react";
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
  Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

// Mock Data
const operationalMetrics = [
  { id: "solicitadas", title: "Peças Solicitadas", value: "128", icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50", clickable: true },
  { id: "cura", title: "Peças em Cura", value: "45", icon: Clock, color: "text-amber-600", bg: "bg-amber-50", clickable: false },
  { id: "aptas", title: "Aptas a Retirar", value: "89", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", clickable: false },
];

const financialMetrics = [
  {
    title: "Receita (Mensal)",
    value: "R$ 450.000",
    annual: "R$ 5.2M",
    trend: "+12.5%",
    up: true,
    icon: DollarSign,
    color: "text-emerald-600"
  },
  {
    title: "Saídas (Mensal)",
    value: "R$ 280.000",
    annual: "R$ 3.1M",
    trend: "-2.4%",
    up: false,
    icon: TrendingDown,
    color: "text-red-600"
  },
];

const segments = [
  "Manilhão", "Estacas", "Pilar", "Viga Protendida", "Blocos", "Tubos", "Lajes"
];

const auditEvents = [
  { id: 1, type: "entrada", item: "Cimento CP-V", qty: "20t", time: "08:30", user: "João Silva" },
  { id: 2, type: "saida", item: "Viga V-102", qty: "2un", time: "10:15", user: "Maria Santos" },
  { id: 3, type: "entrada", item: "Aço CA-50 10mm", qty: "500kg", time: "11:00", user: "Carlos Lima" },
  { id: 4, type: "saida", item: "Pilar P-45", qty: "1un", time: "14:20", user: "João Silva" },
];

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const openModal = (title: string) => {
    setModalTitle(title);
    setModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Geral</h1>
        <p className="text-slate-500">Bem-vindo ao ERP de Pré-moldados. Aqui está o resumo da operação.</p>
      </div>

      {/* Operational Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {operationalMetrics.map((metric) => (
          <Card
            key={metric.id}
            className={cn(metric.clickable && "cursor-pointer hover:border-blue-300")}
            onClick={() => metric.clickable && openModal(metric.title)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{metric.title}</CardTitle>
              <div className={cn("p-2 rounded-lg", metric.bg)}>
                <metric.icon className={cn("w-5 h-5", metric.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metric.value}</div>
              <p className="text-xs text-slate-400 mt-1">Atualizado em tempo real</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Financial Vision */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Visão Financeira</h2>
            <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
              Ver relatório completo <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {financialMetrics.map((metric, idx) => (
              <Card key={idx}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">{metric.title}</CardTitle>
                  <metric.icon className={cn("w-5 h-5", metric.color)} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn(
                      "flex items-center text-xs font-medium px-2 py-0.5 rounded-full",
                      metric.up ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    )}>
                      {metric.up ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {metric.trend}
                    </span>
                    <span className="text-xs text-slate-400">vs. mês anterior</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>Acumulado Anual:</span>
                      <span className="font-semibold text-slate-900">{metric.annual}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Monthly Production Summary */}
          <Card className="cursor-pointer" onClick={() => openModal("Produzidas no Mês")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                Produzidas no Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-4xl font-bold text-slate-900">1,240</div>
                  <p className="text-slate-500 text-sm mt-1">Peças finalizadas em Outubro</p>
                </div>
                <div className="text-right">
                  <div className="text-emerald-600 font-semibold text-sm">+8% meta</div>
                  <div className="w-32 h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Segments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Segmentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {segments.map((s) => (
                  <span key={s} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Audit Log */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4" />
                Auditoria
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-0">
                {auditEvents.map((event) => (
                  <div key={event.id} className="px-6 py-3 hover:bg-slate-50 flex items-center justify-between border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        event.type === "entrada" ? "bg-emerald-500" : "bg-blue-500"
                      )} />
                      <div>
                        <div className="text-sm font-medium text-slate-900">{event.item}</div>
                        <div className="text-xs text-slate-500">{event.user} • {event.time}</div>
                      </div>
                    </div>
                    <div className={cn(
                      "text-sm font-bold",
                      event.type === "entrada" ? "text-emerald-600" : "text-blue-600"
                    )}>
                      {event.type === "entrada" ? "+" : "-"}{event.qty}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Detail */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase">
                <th className="px-4 py-3 font-semibold">Cód. Peça</th>
                <th className="px-4 py-3 font-semibold">Descrição</th>
                <th className="px-4 py-3 font-semibold">Cliente/Obra</th>
                <th className="px-4 py-3 font-semibold">Data</th>
                <th className="px-4 py-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium">#PM-10{i}</td>
                  <td className="px-4 py-4 text-sm">Viga V-{i}02</td>
                  <td className="px-4 py-4 text-sm text-slate-500">Residencial Aurora</td>
                  <td className="px-4 py-4 text-sm text-slate-500">12/10/2023</td>
                  <td className="px-4 py-4 text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Processando
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}
