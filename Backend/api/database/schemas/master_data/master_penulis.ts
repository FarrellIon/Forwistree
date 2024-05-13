import { Schema, model, Types } from 'mongoose';

interface MasterPenulis {
    id: String,
    nama: String,
    nama_pena: String,
    added_by: Types.ObjectId,
    pivot_penulis_buku: Types.ObjectId[],
    createdAt: Date,
    updatedAt: Date
}

const MasterPenulisSchema = new Schema<MasterPenulis>(
    {
        id: {
            type: String,
            required: true
        },
        nama: {
            type: String
        },
        nama_pena: {
            type: String,
            required: true
        },
        pivot_penulis_buku: [
            {
                type: Schema.Types.ObjectId,
                ref: 'pivot_penulis_buku'
            }
        ]
    },
    { timestamps: true }
);

export const MasterPenulis = model<MasterPenulis>('master_penulis', MasterPenulisSchema, 'master_penulis');