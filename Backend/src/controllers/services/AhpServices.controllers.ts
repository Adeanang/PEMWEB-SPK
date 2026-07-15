import { prisma } from "../../config/prisma";


export interface AHPResult {
  weights: {
    kriteriaId: number;
    nama: string;
    bobot: number;
  }[];

  matrix: number[][];

  normalizedMatrix: number[][];

  lambdaMax: number;

  ci: number;

  cr: number;
}


const RI: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0.58,
  4: 0.9,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
};



export const calculateAHP = async (
  rekomendasiId: number
): Promise<AHPResult> => {
  console.log("AHP-1");


  // ===========================
  // AMBIL KRITERIA
  // ===========================
console.log("AHP-1");
  const kriterias = await prisma.kriteria.findMany({
    orderBy:{
      id:"asc"
    }
  });
  console.log("AHP-2");


  const n = kriterias.length;


  if(n < 2){
    throw new Error(
      "Minimal harus ada 2 kriteria"
    );
  }



  // ===========================
  // AMBIL PERBANDINGAN
  // ===========================

console.log("TES-1");

const comparisons = await prisma.perbandinganKriteria.findMany();

console.log("TES-2");
console.log(comparisons);

  if(comparisons.length === 0){
    throw new Error(
      "Data perbandingan kriteria belum tersedia"
    );
  }




  // ===========================
  // BUAT MATRIX AHP
  // ===========================


  const matrix:number[][] = Array.from(
    {
      length:n
    },
    ()=>Array(n).fill(1)
  );



  for(const item of comparisons){


    const row =
      kriterias.findIndex(
        k=>k.id === item.kriteria1Id
      );


    const col =
      kriterias.findIndex(
        k=>k.id === item.kriteria2Id
      );



    if(row === -1 || col === -1){
      continue;
    }



    matrix[row][col]
      = item.nilai;


    matrix[col][row]
      = 1 / item.nilai;

  }





  // ===========================
  // TOTAL KOLOM
  // ===========================


  const columnTotals:number[]=[];


  for(let j=0;j<n;j++){

    let total=0;


    for(let i=0;i<n;i++){

      total += matrix[i][j];

    }


    columnTotals.push(total);

  }






  // ===========================
  // NORMALISASI MATRIX
  // ===========================


  const normalizedMatrix:number[][]=[];


  for(let i=0;i<n;i++){


    normalizedMatrix[i]=[];


    for(let j=0;j<n;j++){


      normalizedMatrix[i][j]
      =
      matrix[i][j] /
      columnTotals[j];


    }

  }





  // ===========================
  // HITUNG PRIORITY VECTOR
  // ===========================


  const priorityVector:number[]=[];



  for(let i=0;i<n;i++){


    let total=0;


    for(let j=0;j<n;j++){


      total += normalizedMatrix[i][j];


    }


    priorityVector.push(
      total/n
    );

  }





  // ===========================
  // WEIGHTED SUM VECTOR
  // ===========================


  const weightedSum:number[]=[];


  for(let i=0;i<n;i++){


    let total=0;


    for(let j=0;j<n;j++){


      total += 
      matrix[i][j] *
      priorityVector[j];


    }


    weightedSum.push(total);

  }





  // ===========================
  // CONSISTENCY VECTOR
  // ===========================


  const consistencyVector =
    weightedSum.map(
      (value,index)=>
        value / priorityVector[index]
    );





  // ===========================
  // LAMBDA MAX
  // ===========================


  const lambdaMax =
    consistencyVector.reduce(
      (a,b)=>a+b,
      0
    ) / n;





  // ===========================
  // CI
  // ===========================


  const ci =
    (lambdaMax-n)/(n-1);





  // ===========================
  // CR
  // ===========================


  const ri =
    RI[n] ?? 1.49;


  const cr =
    ri===0
    ?
    0
    :
    ci/ri;





  // ===========================
  // FORMAT WEIGHT
  // ===========================


  const weights =
    kriterias.map(
      (item,index)=>({

        kriteriaId:item.id,

        nama:item.nama,

        bobot:
        Number(
          priorityVector[index]
          .toFixed(6)
        )

      })
    );






  return {


    weights,


    matrix,


    normalizedMatrix,


    lambdaMax,


    ci,


    cr

  };


};