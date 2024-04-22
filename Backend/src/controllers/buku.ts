import { Request, Response } from 'express';
import { Buku } from '../database/schemas/buku';

class KategoriController{
    get = async(req: Request, res: Response) => {
        const kategori = await Buku.find({}).sort('-createdAt');

        if (kategori?.length === 0) {
            throw new Error("Belum ada data kategori");
        }

        res.status(200).json({
            kategori,
            msg: "Berhasil"
        });
    }

    getOne = async(req: Request, res: Response) => {
        const { id } = req.params;
        const kategori = await Buku.findById({ _id: id });

        if (!kategori){
            throw new Error("Tidak ditemukan kategori dengan id tersebut");
        }

        res.status(200).json({
            kategori,
            msg: "Berhasil"
        });
    }

    create = async(req: Request, res: Response) => {
        const { nama } = req.body;

        if (!nama){
            throw new Error('Tidak ada nama kategori');
        }

        const newKategori = await Buku.create(req.body);
        res.status(201).json({
            kategori: newKategori,
            msg: "Berhasil"
        });
    }

    update = async(req: Request, res: Response) => {
        const { id } = req.params;
        const kategori = await Buku.findByIdAndUpdate({ _id: id }, req.body, { new: true })

        if (!kategori){
            throw new Error('Tidak ditemukan kategori dengan id tersebut!');
        }

        res.status(200).json({
            kategori: kategori,
            msg: "Berhasil"
        });
    }

    delete = async(req: Request, res: Response) => {
        const { id } = req.params;
        const kategori = await Buku.findByIdAndDelete({ _id: id });

        if (!kategori){
            throw new Error("Tidak ditemukan kategori dengan id tersebut!");
        }

        res.status(200).json({
            kategori,
            msg: "Berhasil"
        });
    }
}

export const kategoriController = new KategoriController();