import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const pilar = await prisma.tipoPeca.upsert({
    where: { nome: "Pilar" },
    update: {},
    create: { nome: "Pilar", tempoCuraPadrao: 7 },
  });

  const viga = await prisma.tipoPeca.upsert({
    where: { nome: "Viga" },
    update: {},
    create: { nome: "Viga", tempoCuraPadrao: 10 },
  });

  const estaca = await prisma.tipoPeca.upsert({
    where: { nome: "Estaca" },
    update: {},
    create: { nome: "Estaca", tempoCuraPadrao: 5 },
  });

  console.log("Seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
