import { Schema, model, Types } from 'mongoose';

interface MasterPenulis {
    id: String,
    nama: String,
    nama_pena: String,
    email: String,
    no_wa: String,
    added_by: Types.ObjectId,
    pengajuan_penerbitan: Types.ObjectId[],
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
        email: {
            type: String,
            required: true
        },
        no_wa: {
            type: String,
            required: true
        },
        pengajuan_penerbitan: [
            {
                type: Schema.Types.ObjectId,
                ref: 'pengajuan_penerbitan'
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

export const MasterPenulis = model<MasterPenulis>('master_penulis', MasterPenulisSchema, 'master_penulis');