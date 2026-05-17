"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSolicitacao(formData: FormData) {
  const requisitante = formData.get("requisitante") as string;
  const descricao = formData.get("descricao") as string;

  await prisma.solicitacaoCompra.create({
    data: {
      requisitante,
      descricao,
    },
  });

  revalidatePath("/suprimentos");
}

export async function addCotacao(solicitacaoId: string, formData: FormData) {
  const fornecedor = formData.get("fornecedor") as string;
  const preco = parseFloat(formData.get("preco") as string);
  const prazoEntrega = parseInt(formData.get("prazoEntrega") as string);

  await prisma.cotacao.create({
    data: {
      solicitacaoId,
      fornecedor,
      preco,
      prazoEntrega,
    },
  });

  revalidatePath("/suprimentos");
}

export async function aprovarCotacao(cotacaoId: string) {
  const cotacao = await prisma.cotacao.update({
    where: { id: cotacaoId },
    data: { status: "APROVADA" },
  });

  await prisma.solicitacaoCompra.update({
    where: { id: cotacao.solicitacaoId },
    data: { status: "FINALIZADA" },
  });

  // Criar Pedido de Compra automaticamente
  await prisma.pedidoCompra.create({
    data: {
      cotacaoId: cotacao.id,
      status: "AGUARDANDO_AUTORIZACAO",
    },
  });

  revalidatePath("/suprimentos");
}

export async function autorizarPedido(pedidoId: string, gestor: string) {
  await prisma.pedidoCompra.update({
    where: { id: pedidoId },
    data: {
      status: "AUTORIZADO",
      autorizadoPor: gestor,
      dataAutorizacao: new Date(),
    },
  });

  revalidatePath("/suprimentos");
}

export async function lancarNotaFiscal(pedidoId: string, formData: FormData) {
  const numero = formData.get("numero") as string;
  const valor = parseFloat(formData.get("valor") as string);
  const dataEmissao = new Date(formData.get("dataEmissao") as string);

  const nf = await prisma.notaFiscal.create({
    data: {
      pedidoId,
      numero,
      valor,
      dataEmissao,
    },
  });

  // Gerar Despesa automaticamente no Financeiro
  await prisma.despesa.create({
    data: {
      notaFiscalId: nf.id,
      valor,
      vencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias por padrão
      descricao: `NF ${numero} - Ref. Pedido ${pedidoId.substring(0, 8)}`,
      status: "PENDENTE",
    },
  });

  await prisma.pedidoCompra.update({
    where: { id: pedidoId },
    data: { status: "CONCLUIDO" },
  });

  revalidatePath("/suprimentos");
  revalidatePath("/financeiro");
}
