import { Schema, model, Types } from 'mongoose';

interface MasterKategori {
    id: String,
    nama: String,
    buku: Types.ObjectId[],
    added_by: Types.ObjectId,
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
        },
        added_by: {
            type: Schema.Types.ObjectId,
            ref: 'admins',
            required: true
        },
        buku: [
            {
                type: Schema.Types.ObjectId,
                ref: 'buku'
            }
        ]
    },
    { timestamps: true }
);

export const MasterKategori = model<MasterKategori>('master_kategori', MasterKategoriSchema, 'master_kategori');