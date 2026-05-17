import React from "react";
import { prisma } from "@/lib/prisma";
import {
  Plus,
  Settings2,
  Hammer,
  Timer,
  CheckCircle2,
  Package,
  Factory
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { upsertTipoPeca, createPeca } from "@/actions/producao";

export default async function ProducaoPage() {
  const tiposPeca = await prisma.tipoPeca.findMany({
    orderBy: { nome: "asc" },
  });

  const pecasRecentes = await prisma.peca.findMany({
    include: { tipo: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="p-8 space-y-8 bg-[#0b0f1a] min-h-screen text-slate-200">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Produção</h1>
        <p className="text-slate-400 mt-1 font-medium">Controle de fabricação e tempo de cura</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuração de Tipos de Peça */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-2 text-blue-400 font-bold uppercase text-xs tracking-widest">
            <Settings2 className="w-4 h-4" />
            Configuração de Peças
          </div>

          <Card className="bg-[#161e31] border-slate-800/50">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-300">Novo Tipo de Peça</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={upsertTipoPeca} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nome da Peça</label>
                  <input
                    name="nome"
                    required
                    placeholder="Ex: Pilar 30x30, Viga V1"
                    className="w-full bg-[#0b0f1a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tempo de Cura (Dias)</label>
                  <input
                    name="tempoCuraPadrao"
                    type="number"
                    defaultValue={7}
                    required
                    className="w-full bg-[#0b0f1a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-sm transition-colors">
                  Salvar Tipo
                </button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Tipos Cadastrados</h4>
            {tiposPeca.map((t) => (
              <div key={t.id} className="bg-[#161e31] p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-200">{t.nome}</span>
                <span className="text-xs text-blue-400 font-black">{t.tempoCuraPadrao} Dias</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lançamento de Produção */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-xs tracking-widest">
            <Hammer className="w-4 h-4" />
            Registro de Produção Diária
          </div>

          <Card className="bg-[#161e31] border-slate-800/50">
            <CardContent className="p-6">
              <form action={createPeca} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Código da Peça (Identificador)</label>
                  <input
                    name="codigo"
                    required
                    placeholder="Ex: P-2024-001"
                    className="w-full bg-[#0b0f1a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Peça</label>
                  <select
                    name="tipoPecaId"
                    required
                    className="w-full bg-[#0b0f1a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">Selecione um tipo...</option>
                    {tiposPeca.map(t => (
                      <option key={t.id} value={t.id}>{t.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Cliente / Obra de Destino</label>
                  <input
                    name="clienteObra"
                    placeholder="Nome do cliente ou código da obra"
                    className="w-full bg-[#0b0f1a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <button className="md:col-span-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                  <Factory className="w-4 h-4" />
                  Registrar Produção e Iniciar Cura
                </button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Peças Recentes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pecasRecentes.map((p) => {
                const dataCura = new Date(p.dataProducao);
                dataCura.setDate(dataCura.getDate() + p.tipo.tempoCuraPadrao);
                const hoje = new Date();
                const apta = hoje >= dataCura;

                return (
                  <Card key={p.id} className="bg-[#161e31] border-slate-800/50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[10px] text-slate-500 font-black uppercase mb-1">#{p.codigo}</div>
                          <h3 className="text-sm font-bold text-white">{p.tipo.nome}</h3>
                          <p className="text-xs text-slate-400 mt-1">{p.clienteObra || "Estoque Geral"}</p>
                        </div>
                        <div className="text-right">
                          {apta ? (
                            <div className="flex items-center gap-1 text-emerald-500 font-black text-[10px] uppercase">
                              <CheckCircle2 className="w-3 h-3" />
                              Apta para Retirada
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-amber-500 font-black text-[10px] uppercase">
                              <Timer className="w-3 h-3" />
                              Em Cura
                            </div>
                          )}
                          <div className="text-[9px] text-slate-600 mt-1">Produzida em: {new Date(p.dataProducao).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
