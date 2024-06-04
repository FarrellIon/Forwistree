import { Schema, model, Types } from 'mongoose';

interface Buku {
    id: String,
    nama: String,
    deskripsi: String,
    kategori: Types.ObjectId,
    file_sinopsis: String,
    jumlah_halaman: Number,
    harga: Number,
    diskon: Number,
    status_bestseller: Boolean,
    status_editors_pick: Boolean,
    link_shopee: String,
    added_by: Types.ObjectId,
    gambar_buku: Types.ObjectId[],
    pivot_penulis_buku: Types.ObjectId[],
    tanggal_terbit: Date,
    createdAt: Date,
    updatedAt: Date
}

const BukuSchema = new Schema<Buku>(
    {
        id: {
            type: String,
            required: true
        },
        nama: {
            type: String,
            required: true
        },
        deskripsi: {
            type: String,
            required: true
        },
        kategori: {
            type: Schema.Types.ObjectId,
            ref: 'master_kategori',
            required: true
        },
        file_sinopsis: {
            type: String,
            required: true
        },
        jumlah_halaman: {
            type: Number,
            required: true
        },
        harga: {
            type: Number,
            required: true
        },
        diskon: {
            type: Number,
            required: true,
            default: 0
        },
        status_bestseller: {
            type: Boolean,
            required: true,
            default: false
        },
        status_editors_pick: {
            type: Boolean,
            required: true,
            default: false
        },
        link_shopee: {
            type: String,
            required: true,
        },
        added_by: {
            type: Schema.Types.ObjectId,
            ref: 'admins',
            required: true
        },
        tanggal_terbit: {
            type: Date
        },
        gambar_buku: [
            {
                type: Schema.Types.ObjectId,
                ref: 'gambar_buku'
            }
        ],
        pivot_penulis_buku: [
            {
                type: Schema.Types.ObjectId,
                ref: 'pivot_penulis_buku'
            }
        ]
    },
    { timestamps: true }
);

export const Buku = model<Buku>('buku', BukuSchema, 'buku');