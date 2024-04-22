import { Schema, model } from 'mongoose';

interface MasterKategori {
    id: String,
    nama: String,
    createdAt: Date,
    updatedAt: Date
}

const MasterKategoriSchema = new Schema<MasterKategori>(
    {
        id: {
            type: String,
            required: true
        },
        nama: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export const MasterKategori = model<MasterKategori>('master_kategori', MasterKategoriSchema, 'master_kategori');