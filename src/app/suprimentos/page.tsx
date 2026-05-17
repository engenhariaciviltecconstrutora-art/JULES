import React from "react";
import { prisma } from "@/lib/prisma";
import {
  ClipboardList,
  Search,
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  Banknote,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import {
  createSolicitacao,
  addCotacao,
  aprovarCotacao,
  autorizarPedido,
  lancarNotaFiscal
} from "@/actions/suprimentos";

export default async function SuprimentosPage() {
  const solicitacoes = await prisma.solicitacaoCompra.findMany({
    include: { cotacoes: { include: { pedidoCompra: true } } },
    orderBy: { createdAt: "desc" },
  });

  const pedidos = await prisma.pedidoCompra.findMany({
    include: {
      cotacao: {
        include: { solicitacao: true }
      },
      notaFiscal: true
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 space-y-8 bg-[#0b0f1a] min-h-screen text-slate-200">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Suprimentos</h1>
          <p className="text-slate-400 mt-1 font-medium">Gestão de compras e fluxo de suprimentos</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar processos..."
              className="pl-10 pr-4 py-2 bg-[#161e31] border border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64 text-white"
            />
          </div>
        </div>
      </div>

      {/* 1. Solicitação de Compras */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-blue-400 font-bold uppercase text-xs tracking-widest">
          <ClipboardList className="w-4 h-4" />
          1. Solicitações de Compras
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-[#161e31] border-slate-800/50 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-300">Nova Solicitação</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createSolicitacao} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Mestre / Requisitante</label>
                  <input
                    name="requisitante"
                    required
                    placeholder="Nome do solicitante"
                    className="w-full bg-[#0b0f1a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Descrição dos Materiais</label>
                  <textarea
                    name="descricao"
                    required
                    placeholder="Ex: 50 sacos de cimento, 2 toneladas de areia..."
                    rows={4}
                    className="w-full bg-[#0b0f1a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Enviar Solicitação
                </button>
              </form>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            {solicitacoes.filter(s => s.status === "PENDENTE").map((s) => (
              <Card key={s.id} className="bg-[#161e31] border-slate-800/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-black uppercase">Pendente</span>
                        <span className="text-xs text-slate-500 font-bold">{new Date(s.dataSolicitacao).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{s.requisitante}</h3>
                      <p className="text-sm text-slate-400 mt-2">{s.descricao}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <span className="text-[10px] text-slate-600 font-mono block">{s.id}</span>
                    </div>
                  </div>

                  {/* 2. Cotações */}
                  <div className="mt-4 pt-4 border-t border-slate-800/50">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Cotações (Máx 3)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {s.cotacoes.map((c) => (
                        <div key={c.id} className="bg-[#0b0f1a] p-3 rounded-lg border border-slate-800 relative group">
                          <div className="text-xs font-bold text-slate-200">{c.fornecedor}</div>
                          <div className="text-lg font-black text-emerald-500 mt-1">R$ {c.preco.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-500 mt-1">{c.prazoEntrega} dias úteis</div>
                          {c.status === "EM_ANALISE" && (
                            <form action={aprovarCotacao.bind(null, c.id)}>
                              <button className="mt-2 w-full bg-emerald-600/20 hover:bg-emerald-600 text-emerald-500 hover:text-white text-[10px] font-bold py-1 rounded transition-all">
                                Aprovar para Pedido
                              </button>
                            </form>
                          )}
                          {c.status === "APROVADA" && (
                            <div className="mt-2 text-center text-[10px] font-bold text-emerald-500 uppercase">Aprovada</div>
                          )}
                        </div>
                      ))}
                      {s.cotacoes.length < 3 && (
                        <form action={async (fd) => {
                          "use server";
                          await addCotacao(s.id, fd);
                        }} className="p-3 border border-dashed border-slate-800 rounded-lg space-y-2">
                          <input name="fornecedor" placeholder="Fornecedor" className="w-full bg-transparent text-[10px] text-white outline-none border-b border-slate-800 pb-1" required />
                          <input name="preco" type="number" step="0.01" placeholder="Preço" className="w-full bg-transparent text-[10px] text-white outline-none border-b border-slate-800 pb-1" required />
                          <input name="prazoEntrega" type="number" placeholder="Prazo (dias)" className="w-full bg-transparent text-[10px] text-white outline-none border-b border-slate-800 pb-1" required />
                          <button className="w-full text-[10px] font-bold text-blue-500 hover:text-blue-400">+ Adicionar Cotação</button>
                        </form>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3 & 4. Pedidos e Autorizações */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-purple-400 font-bold uppercase text-xs tracking-widest">
          <ShieldCheck className="w-4 h-4" />
          3 & 4. Pedidos e Autorizações
        </div>
        <div className="grid grid-cols-1 gap-4">
          {pedidos.filter(p => p.status !== "CONCLUIDO").map((p) => (
            <Card key={p.id} className="bg-[#161e31] border-slate-800/50">
              <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-full",
                    p.status === "AUTORIZADO" ? "bg-emerald-500/10 text-emerald-500" : "bg-purple-500/10 text-purple-500"
                  )}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">Pedido #{p.id.substring(0, 8)}</span>
                      <span className={cn(
                        "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                        p.status === "AUTORIZADO" ? "bg-emerald-500/10 text-emerald-500" : "bg-purple-500/10 text-purple-500"
                      )}>
                        {p.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Fornecedor: <span className="text-slate-300 font-bold">{p.cotacao.fornecedor}</span> •
                      Valor: <span className="text-emerald-500 font-bold">R$ {p.cotacao.preco.toLocaleString()}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 italic">" {p.cotacao.solicitacao.descricao} "</p>
                  </div>
                </div>

                <div className="flex gap-3 items-center w-full md:w-auto">
                  {p.status === "AGUARDANDO_AUTORIZACAO" && (
                    <form action={autorizarPedido.bind(null, p.id, "Gestor Jules")} className="w-full">
                      <button className="w-full px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Autorizar Pedido
                      </button>
                    </form>
                  )}
                  {p.status === "AUTORIZADO" && (
                    <div className="w-full md:w-80 bg-[#0b0f1a] p-4 rounded-lg border border-slate-800">
                      <h5 className="text-[10px] font-black text-slate-500 uppercase mb-3">5. Lançar Nota Fiscal / Recibo</h5>
                      <form action={lancarNotaFiscal.bind(null, p.id)} className="space-y-2">
                        <input name="numero" placeholder="Número da NF" className="w-full bg-[#161e31] border border-slate-800 rounded px-2 py-1.5 text-xs text-white" required />
                        <div className="flex gap-2">
                          <input name="valor" type="number" step="0.01" defaultValue={p.cotacao.preco} className="w-1/2 bg-[#161e31] border border-slate-800 rounded px-2 py-1.5 text-xs text-white" required />
                          <input name="dataEmissao" type="date" className="w-1/2 bg-[#161e31] border border-slate-800 rounded px-2 py-1.5 text-xs text-white" required />
                        </div>
                        <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] py-2 rounded-lg transition-all uppercase">
                          Finalizar e Gerar Despesa
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {pedidos.filter(p => p.status !== "CONCLUIDO").length === 0 && (
            <div className="text-center p-8 border border-dashed border-slate-800 rounded-xl">
              <p className="text-slate-600 text-sm font-medium">Nenhum pedido aguardando ação no momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. Histórico de NF e Recibos */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-xs tracking-widest">
          <FileText className="w-4 h-4" />
          Histórico de NF e Concluídos
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-800/50">
          <table className="w-full text-left bg-[#161e31]">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase text-slate-500 font-black tracking-widest">
                <th className="px-6 py-4">NF / Recibo</th>
                <th className="px-6 py-4">Fornecedor</th>
                <th className="px-6 py-4">Data Emissão</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Status Financeiro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {pedidos.filter(p => p.status === "CONCLUIDO").map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white">#{p.notaFiscal?.numero}</div>
                    <div className="text-[10px] text-slate-600">Ref: Pedido {p.id.substring(0,6)}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-medium">{p.cotacao.fornecedor}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{p.notaFiscal?.dataEmissao.toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm font-black text-emerald-500">R$ {p.notaFiscal?.valor.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-500">
                      <CheckCircle2 className="w-3 h-3" />
                      Lançado no Financeiro
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
