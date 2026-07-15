-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');

-- CreateTable
CREATE TABLE "public"."user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hotel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "sosial_media" TEXT,
    "image_hotel" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "id_user" INTEGER NOT NULL,
    "id_kategori_hotel" INTEGER NOT NULL,

    CONSTRAINT "hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."kategori_hotel" (
    "id" SERIAL NOT NULL,
    "nama_kategori" TEXT NOT NULL,

    CONSTRAINT "kategori_hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."kategori_kamar" (
    "id_kamar" SERIAL NOT NULL,
    "id_hotel" INTEGER NOT NULL,
    "nama_kategori" TEXT NOT NULL,
    "deskripsi" TEXT,
    "kapasitas_orang" TEXT NOT NULL,

    CONSTRAINT "kategori_kamar_pkey" PRIMARY KEY ("id_kamar")
);

-- CreateTable
CREATE TABLE "public"."kamar" (
    "id_kamar" SERIAL NOT NULL,
    "id_hotel" INTEGER NOT NULL,
    "id_kategori" INTEGER NOT NULL,
    "nomor_kamar" TEXT NOT NULL,

    CONSTRAINT "kamar_pkey" PRIMARY KEY ("id_kamar")
);

-- CreateTable
CREATE TABLE "public"."fasilitas_hotel" (
    "id_fasilitas" SERIAL NOT NULL,
    "id_hotel" INTEGER NOT NULL,
    "fasilitas" TEXT NOT NULL,

    CONSTRAINT "fasilitas_hotel_pkey" PRIMARY KEY ("id_fasilitas")
);

-- CreateTable
CREATE TABLE "public"."kriteria" (
    "id_kriteria" SERIAL NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "id_hotel" INTEGER NOT NULL,
    "bobot" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "kriteria_pkey" PRIMARY KEY ("id_kriteria")
);

-- CreateTable
CREATE TABLE "public"."sub_kriteria" (
    "id_sub" SERIAL NOT NULL,
    "kriteria_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "skor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "sub_kriteria_pkey" PRIMARY KEY ("id_sub")
);

-- CreateTable
CREATE TABLE "public"."rekomendasi_request" (
    "id_rekomendasi" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "kategori_hotel_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rekomendasi_request_pkey" PRIMARY KEY ("id_rekomendasi")
);

-- CreateTable
CREATE TABLE "public"."rekomendasi_req_kriteria" (
    "id_req" SERIAL NOT NULL,
    "id_rekomendasi" INTEGER NOT NULL,
    "kriteria_id" INTEGER NOT NULL,
    "bobot" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "rekomendasi_req_kriteria_pkey" PRIMARY KEY ("id_req")
);

-- CreateTable
CREATE TABLE "public"."result_request" (
    "id_result" SERIAL NOT NULL,
    "id_rekomendasi" INTEGER NOT NULL,
    "id_hotel" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "rangking" INTEGER NOT NULL,

    CONSTRAINT "result_request_pkey" PRIMARY KEY ("id_result")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- AddForeignKey
ALTER TABLE "public"."hotel" ADD CONSTRAINT "hotel_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."hotel" ADD CONSTRAINT "hotel_id_kategori_hotel_fkey" FOREIGN KEY ("id_kategori_hotel") REFERENCES "public"."kategori_hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."kategori_kamar" ADD CONSTRAINT "kategori_kamar_id_hotel_fkey" FOREIGN KEY ("id_hotel") REFERENCES "public"."hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."kamar" ADD CONSTRAINT "kamar_id_hotel_fkey" FOREIGN KEY ("id_hotel") REFERENCES "public"."hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."kamar" ADD CONSTRAINT "kamar_id_kategori_fkey" FOREIGN KEY ("id_kategori") REFERENCES "public"."kategori_kamar"("id_kamar") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fasilitas_hotel" ADD CONSTRAINT "fasilitas_hotel_id_hotel_fkey" FOREIGN KEY ("id_hotel") REFERENCES "public"."hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."kriteria" ADD CONSTRAINT "kriteria_id_hotel_fkey" FOREIGN KEY ("id_hotel") REFERENCES "public"."hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sub_kriteria" ADD CONSTRAINT "sub_kriteria_kriteria_id_fkey" FOREIGN KEY ("kriteria_id") REFERENCES "public"."kriteria"("id_kriteria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rekomendasi_request" ADD CONSTRAINT "rekomendasi_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rekomendasi_request" ADD CONSTRAINT "rekomendasi_request_kategori_hotel_id_fkey" FOREIGN KEY ("kategori_hotel_id") REFERENCES "public"."kategori_hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rekomendasi_req_kriteria" ADD CONSTRAINT "rekomendasi_req_kriteria_id_rekomendasi_fkey" FOREIGN KEY ("id_rekomendasi") REFERENCES "public"."rekomendasi_request"("id_rekomendasi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rekomendasi_req_kriteria" ADD CONSTRAINT "rekomendasi_req_kriteria_kriteria_id_fkey" FOREIGN KEY ("kriteria_id") REFERENCES "public"."kriteria"("id_kriteria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."result_request" ADD CONSTRAINT "result_request_id_rekomendasi_fkey" FOREIGN KEY ("id_rekomendasi") REFERENCES "public"."rekomendasi_request"("id_rekomendasi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."result_request" ADD CONSTRAINT "result_request_id_hotel_fkey" FOREIGN KEY ("id_hotel") REFERENCES "public"."hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
