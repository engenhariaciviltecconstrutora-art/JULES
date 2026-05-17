"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function upsertTipoPeca(formData: FormData) {
  const id = formData.get("id") as string;
  const nome = formData.get("nome") as string;
  const tempoCuraPadrao = parseInt(formData.get("tempoCuraPadrao") as string);

  if (id) {
    await prisma.tipoPeca.update({
      where: { id },
      data: { nome, tempoCuraPadrao },
    });
  } else {
    await prisma.tipoPeca.create({
      data: { nome, tempoCuraPadrao },
    });
  }

  revalidatePath("/producao");
}

export async function createPeca(formData: FormData) {
  const codigo = formData.get("codigo") as string;
  const tipoPecaId = formData.get("tipoPecaId") as string;
  const clienteObra = formData.get("clienteObra") as string;

  await prisma.peca.create({
    data: {
      codigo,
      tipoPecaId,
      clienteObra,
      status: "EM_CURA",
    },
  });

  revalidatePath("/producao");
  revalidatePath("/");
}
