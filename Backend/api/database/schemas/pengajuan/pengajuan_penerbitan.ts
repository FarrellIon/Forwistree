import { Schema, model, Types } from 'mongoose';

interface PengajuanPenerbitan {
    id: String,
    pengaju: Types.ObjectId,
    file_sinopsis: String,
    accepted_by: Types.ObjectId,
    createdAt: Date,
    updatedAt: Date
}

const PengajuanPenerbitanSchema = new Schema<PengajuanPenerbitan>(
    {
        id: {
            type: String,
            required: true
        },
        pengaju: {
            type: Schema.Types.ObjectId,
            ref: 'pengaju',
            required: true
        },
        file_sinopsis: {
            type: String,
            required: true
        },
        accepted_by: {
            type: Schema.Types.ObjectId,
            ref: 'admins',
        }
    },
    { timestamps: true }
);

export const PengajuanPenerbitan = model<PengajuanPenerbitan>('pengajuan_penerbitan', PengajuanPenerbitanSchema, 'pengajuan_penerbitan');