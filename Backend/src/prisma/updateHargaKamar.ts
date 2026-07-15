import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  const kamar = await prisma.kategoriKamar.findMany();


  for (const item of kamar) {

    let hargaMin = 300000;
    let hargaMax = 400000;


    const nama = item.namaKategori.toLowerCase();


    if (nama.includes("superior")) {
      hargaMin = 350000;
      hargaMax = 500000;
    }


    if (nama.includes("deluxe")) {
      hargaMin = 500000;
      hargaMax = 800000;
    }


    if (nama.includes("family")) {
      hargaMin = 700000;
      hargaMax = 1000000;
    }


    if (nama.includes("executive")) {
      hargaMin = 900000;
      hargaMax = 1500000;
    }


    await prisma.kategoriKamar.update({
      where:{
        id:item.id
      },
      data:{
        hargaMin,
        hargaMax
      }
    });


    console.log(
      `${item.namaKategori} => ${hargaMin} - ${hargaMax}`
    );

  }

}


main()
.finally(async()=>{
 await prisma.$disconnect();
});