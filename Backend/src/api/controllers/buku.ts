import { Request, Response } from 'express';
import { Buku } from '../database/schemas/buku';
import { encryptString, decryptString } from '../utils/encryption';
import { Types } from 'mongoose';
import validator from 'validator';
import cloudinary from '../utils/cloudinary';

class BukuController{
    get = async(req: Request, res: Response) => {
        const buku = await Buku.find({}).sort('-createdAt');

        if (buku?.length === 0) {
            res.status(500).send('Belum ada data buku');
            return;
        }

        res.status(200).json({
            buku,
            msg: "Berhasil"
        });
    }

    getOne = async(req: Request, res: Response) => {
        const { id } = req.params;
        const decryptedId = decryptString(id);
        const buku = await Buku.findById({ _id: decryptedId });

        if (!buku){
            res.status(500).send('Tidak ditemukan buku dengan id tersebut');
            return;
        }

        res.status(200).json({
            buku,
            msg: "Berhasil"
        });
    }

    create = async(req: Request, res: Response) => {
        const { 
            nama,
            kategori,
            ...rest
        } = req.body;

        interface UploadResult {
            url: string
        }

        const fileBuffer = req.file!.buffer;
        const uploadResult: UploadResult = await new Promise((resolve) => {
            cloudinary.v2.uploader.upload_stream((error: Error, uploadResult: UploadResult) => {
                return resolve(uploadResult);
            }).end(fileBuffer);
        });
        const file_sinopsis = uploadResult.url;

        const requiredFields = ['nama', 'kategori', 'jumlah_halaman', 'harga', 'diskon', 'status_bestseller'];
        let errorMsg: string = '';
        
        for (const field of requiredFields) {
            if (!req.body[field]) {
                errorMsg += `Tidak ada ${field.replace('_', ' ')}\n`;
            }
        }

        if(errorMsg != ''){
            res.status(500).send(errorMsg);
            return;
        }

        if(req.file!.fieldname != 'file_sinopsis'){
            res.status(500).send('File terlampir bukan file sinopsis');
            return;
        }

        if (!validator.isAlphanumeric(nama)){
            res.status(500).send('Nama buku tidak valid');
            return;
        }

        const objectId = new Types.ObjectId();
        const encryptedId = encryptString(objectId.toString());
        const kategoriId = decryptString(kategori);

        const newBukuObj = {
            _id: objectId,
            id: encryptedId,
            nama: nama,
            kategori: new Types.ObjectId(kategoriId),
            file_sinopsis: file_sinopsis,
            ...rest
        }

        console.log(newBukuObj);

        const newBuku = await Buku.create(newBukuObj);
        res.status(201).json({
            buku: newBuku,
            msg: "Berhasil"
        });
    }

    update = async(req: Request, res: Response) => {
        const { id } = req.params;
        const decryptedId = decryptString(id);
        const buku = await Buku.findByIdAndUpdate({ _id: decryptedId }, req.body, { new: true })

        if (!buku){
            res.status(500).send('Tidak ditemukan buku dengan id tersebut!');
            return;
        }

        res.status(200).json({
            buku: buku,
            msg: "Berhasil"
        });
    }

    delete = async(req: Request, res: Response) => {
        const { id } = req.params;
        const decryptedId = decryptString(id);
        const buku = await Buku.findByIdAndDelete({ _id: decryptedId });

        if (!buku){
            res.status(500).send('Tidak ditemukan buku dengan id tersebut!');
            return;
        }

        res.status(200).json({
            buku,
            msg: "Berhasil"
        });
    }
}

export const bukuController = new BukuController();