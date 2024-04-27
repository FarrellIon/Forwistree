import { Schema, model } from 'mongoose';

interface GambarBuku {
    id: String,
    buku: Schema.Types.ObjectId,
    image: String,
}

const GambarBukuSchema = new Schema<GambarBuku>(
    {
        id: {
            type: String,
            required: true
        },
        buku: {
            type: Schema.Types.ObjectId,
            ref: 'buku',
            required: true
        },
        image: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);

export const GambarBuku = model<GambarBuku>('gambar_buku', GambarBukuSchema, 'gambar_buku');