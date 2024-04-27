import { Schema, model } from 'mongoose';

interface MasterPenulis {
    id: String,
    nama: String,
    nama_pena: String,
    added_by: Schema.Types.ObjectId,
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
        }
    },
    { timestamps: true }
);

export const MasterPenulis = model<MasterPenulis>('master_penulis', MasterPenulisSchema, 'master_penulis');