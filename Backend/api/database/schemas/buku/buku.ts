import { Schema, model } from 'mongoose';

interface Buku {
    id: String,
    nama: String,
    kategori: Schema.Types.ObjectId,
    file_sinopsis: String,
    jumlah_halaman: Number,
    harga: Number,
    diskon: Number,
    status_bestseller: Boolean,
    added_by: Schema.Types.ObjectId,
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
        added_by: {
            type: Schema.Types.ObjectId,
            ref: 'admins',
            required: true
        }
    },
    { timestamps: true }
);

export const Buku = model<Buku>('buku', BukuSchema, 'buku');