import { Request, Response } from 'express';
import { Buku } from '../../database/schemas/buku/buku';
import { encryptString, decryptString } from '../../utils/encryption';
import { Types } from 'mongoose';
import validator from 'validator';
import cloudinary from '../../utils/cloudinary';
import { MasterKategori } from '../../database/schemas/master_data/master_kategori';

class BukuController{
    get = async(req: Request, res: Response) => {
        const buku = await Buku.find({})
        .populate('kategori', 'nama')
        .sort('-createdAt');

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
        const buku = await Buku.findById({ _id: decryptedId })
        .populate('kategori', 'nama');

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

        const validatorMsg: string = this.validateInputs(req);
        if(validatorMsg != ''){
            res.status(500).send(validatorMsg);
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
            added_by: new Types.ObjectId(), //Temporary Added By
            ...rest
        }

        const newBuku = await Buku.create(newBukuObj);
        res.status(201).json({
            buku: newBuku,
            msg: "Berhasil"
        });
    }

    update = async(req: Request, res: Response) => {
        const { id } = req.params;
        const decryptedId = decryptString(id);

        if (Object.keys(req.body).length === 0){
            res.status(500).send('Belum ada data yang diinput');
            return;
        }

        const validatorMsg: string = this.validateInputs(req);
        if(validatorMsg != ''){
            res.status(500).send(validatorMsg);
            return;
        }

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

    validateInputs = (req: Request) => {
        if(req.body.nama){
            if (!validator.isAlphanumeric(req.body.nama)){
                return 'Nama buku tidak valid';
            }

            if(!validator.isLength(req.body.nama, { min: 1, max: 30 })){    
                return 'Nama buku harus sepanjang 1-30 huruf';
            }
        }

        if(req.body.kategori){
            try {
                const kategoriId = decryptString(req.body.kategori);
                if(!MasterKategori.exists({ _id: new Types.ObjectId(kategoriId) })){
                    return 'Kategori tidak ditemukan';
                }
            } catch (error) {
                return 'Kategori tidak valid';
            }
        }

        if(req.body.jumlah_halaman){
            if(!validator.isInt(req.body.jumlah_halaman, { min: 1 })){
                return 'Jumlah halaman minimal 1';
            }
        }

        if(req.body.harga){
            if(!validator.isInt(req.body.harga, { min: 1 })){
                return 'Harga harus diatas 1';
            }
        }

        if(req.body.diskon){
            if(!validator.isInt(req.body.diskon, { min: 0, max: 100 })){
                return 'Diskon harus bernilai 0 - 100';
            }
        }

        if(req.body.status_bestseller){
            if(!validator.isBoolean(req.body.status_bestseller)){
                return 'Status bestseller harus true / false';
            }
        }

        if(req.file){
            if(req.file.fieldname != 'file_sinopsis'){
                return 'File terlampir bukan file sinopsis';
            }
        }

        return '';
    }
}

export const bukuController = new BukuController();