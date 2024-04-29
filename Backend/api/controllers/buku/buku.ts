import { Request, Response } from 'express';
import { Buku } from '../../database/schemas/buku/buku';
import { MasterKategori } from '../../database/schemas/master_data/master_kategori';
import { GambarBuku } from '../../database/schemas/buku/gambar_buku';
import { encryptString, decryptString } from '../../utils/encryption';
import { Types } from 'mongoose';
import validator from 'validator';
import crypto from 'crypto';
import cloudinary from '../../utils/cloudinary';
import mime from 'mime-types';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

class BukuController{
    get = async(req: Request, res: Response) => {
        try {
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
        } catch (error) {
            res.status(500).send("Terjadi kesalahan, error : " + error);
            return;
        }
    }

    getOne = async(req: Request, res: Response) => {
        try {
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
        } catch (error) {
            res.status(500).send("Terjadi kesalahan, error : " + error);
            return;
        }
    }

    create = async(req: Request, res: Response) => {
        try{
            const { 
                nama,
                kategori,
                ...rest
            } = req.body;
            const { file_sinopsis, gambar_buku } = (req as any).files;

            //Upload Sinopsis
            interface UploadResult {
                secure_url: string
            }

            interface GambarBuku {
                buffer: Buffer
            }

            const validatorMsg: string = this.validateInputs(req);
            if(validatorMsg != ''){
                res.status(500).send(validatorMsg);
                return;
            }

            const unique_id = crypto.randomBytes(16).toString("hex");
            const fileSinopsisBuffer = file_sinopsis[0].buffer;
            const uploadResult: UploadResult = await new Promise((resolve, reject) => {
                cloudinary.v2.uploader.upload_stream({folder: 'forwistree/'+nama+'_'+unique_id+'/file_sinopsis'}, (error: UploadApiErrorResponse | undefined, uploadResult: UploadApiResponse | undefined) => {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(uploadResult as UploadResult);
                    }
                }).end(fileSinopsisBuffer);
            });
            const file_sinopsis_url = uploadResult.secure_url;

            const requiredFields = ['nama', 'kategori', 'jumlah_halaman', 'harga', 'diskon', 'status_bestseller'];
            let errorMsg: string = '';
            
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    errorMsg += `Tidak ada ${field.replace('_', ' ')}\n`;
                }
            }
            
            const requiredFiles = ['file_sinopsis', 'gambar_buku'];
            
            for (const field of requiredFiles) {
                if (!req.files[field]) {
                    errorMsg += `Tidak ada ${field.replace('_', ' ')}\n`;
                }
            }

            if(errorMsg != ''){
                res.status(500).send(errorMsg);
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
                file_sinopsis: file_sinopsis_url,
                added_by: new Types.ObjectId(), //Temporary Added By
                ...rest
            }

            const newBuku = await Buku.create(newBukuObj);

            //Upload Gambar Buku
            gambar_buku.forEach(async (gambar: GambarBuku) => {
                const uploadGambarResult: UploadResult = await new Promise((resolve, reject) => {
                    cloudinary.v2.uploader.upload_stream({folder: 'forwistree/'+nama+'_'+unique_id+'/file_sinopsis'}, (error: UploadApiErrorResponse | undefined, uploadResult: UploadApiResponse | undefined) => {
                        if (error) {
                            return reject(error);
                        } else {
                            return resolve(uploadResult as UploadResult);
                        }
                    }).end(gambar.buffer);
                });

                const gambarObjectId = new Types.ObjectId();
                const encryptedGambarId = encryptString(gambarObjectId.toString());
                const gambar_buku_url = uploadGambarResult.secure_url;
                
                const newGambarBukuObj = {
                    _id: objectId,
                    id: encryptedGambarId,
                    buku: encryptedId,
                    image: gambar_buku_url
                }
    
                await GambarBuku.create(newGambarBukuObj);
            });
            
            res.status(201).json({
                buku: newBuku,
                msg: "Berhasil"
            });
        } catch (error) {
            res.status(500).send("Terjadi kesalahan, error : " + JSON.stringify(error));
            return;
        }
    }

    update = async(req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const decryptedId = decryptString(id);

            const { kategori, ...rest } = req.body
            const kategoriId = decryptString(kategori);
            const newBukuObj = {
                kategori: new Types.ObjectId(kategoriId),
                ...rest
            }

            if (Object.keys(req.body).length === 0){
                res.status(500).send('Belum ada data yang diinput');
                return;
            }

            const validatorMsg: string = this.validateInputs(req);
            if(validatorMsg != ''){
                res.status(500).send(validatorMsg);
                return;
            }

            const buku = await Buku.findByIdAndUpdate({ _id: decryptedId }, newBukuObj, { new: true })
            .populate('kategori', 'nama');

            if (!buku){
                res.status(500).send('Tidak ditemukan buku dengan id tersebut!');
                return;
            }

            res.status(200).json({
                buku: buku,
                msg: "Berhasil"
            });
        } catch (error) {
            res.status(500).send("Terjadi kesalahan, error : " + error);
            return;
        }
    }

    delete = async(req: Request, res: Response) => {
        try {
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
        } catch (error) {
            res.status(500).send("Terjadi kesalahan, error : " + error);
            return;
        }
    }

    validateInputs = (req: Request) => {
        let errorMsg: string = '';

        if(req.body.nama){
            if (!validator.isAlphanumeric(req.body.nama, undefined, {ignore: ' -,&!.?'})){
                errorMsg += 'Nama buku tidak valid';
                errorMsg += '\n';
            }

            if(!validator.isLength(req.body.nama, { min: 1, max: 30 })){    
                errorMsg += 'Nama buku harus sepanjang 1-30 huruf';
                errorMsg += '\n';
            }
        }

        if(req.body.kategori){
            try {
                const kategoriId = decryptString(req.body.kategori);
                if(!MasterKategori.exists({ _id: new Types.ObjectId(kategoriId) })){
                    errorMsg += 'Kategori tidak ditemukan';
                    errorMsg += '\n';
                }
            } catch (error) {
                errorMsg += 'Kategori tidak valid';
                errorMsg += '\n';
            }
        }

        if(req.body.jumlah_halaman){
            if(!validator.isInt(req.body.jumlah_halaman, { min: 1 })){
                errorMsg += 'Jumlah halaman minimal 1';
                errorMsg += '\n';
            }
        }

        if(req.body.harga){
            if(!validator.isInt(req.body.harga, { min: 1 })){
                errorMsg += 'Harga harus diatas 1';
                errorMsg += '\n';
            }
        }

        if(req.body.diskon){
            if(!validator.isInt(req.body.diskon, { min: 0, max: 100 })){
                errorMsg += 'Diskon harus bernilai 0 - 100';
                errorMsg += '\n';
            }
        }

        if(req.body.status_bestseller){
            if(!validator.isBoolean(req.body.status_bestseller)){
                errorMsg += 'Status bestseller harus true / false';
                errorMsg += '\n';
            }
        }

        if(req.file){
            const fileType = mime.contentType(req.file.mimetype);
            if(fileType != 'application/pdf'){
                errorMsg += 'File terlampir harus file pdf';
                errorMsg += '\n';
            }
            if(req.file.fieldname != 'file_sinopsis'){
                errorMsg += 'File terlampir bukan file sinopsis';
                errorMsg += '\n';
            }
        }

        return errorMsg;
    }
}

export const bukuController = new BukuController();