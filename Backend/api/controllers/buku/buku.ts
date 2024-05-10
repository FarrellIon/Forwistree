import { Request, Response } from 'express';
import { Buku } from '../../database/schemas/buku/buku';
import { MasterKategori } from '../../database/schemas/master_data/master_kategori';
import { GambarBuku } from '../../database/schemas/buku/gambar_buku';
import { PivotPenulisBuku } from '../../database/schemas/pivot/pivot_penulis_buku';
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
            //Declarations
            const { 
                nama,
                kategori,
                penulis_buku,
                ...rest
            } = req.body;
            const { file_sinopsis, gambar_buku } = (req as any).files;

            const requiredFields = ['nama', 'kategori', 'jumlah_halaman', 'harga', 'diskon', 'status_bestseller'];
            

            //Validators
            let errorMsg: string = '';
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    errorMsg += `Tidak ada ${field.replace('_', ' ')}\n`;
                }
            }
            
            if(!file_sinopsis || !gambar_buku){
                if(!file_sinopsis){
                    errorMsg += `Tidak ada file sinopsis yang terlampir\n`;
                }
                
                if(!gambar_buku){
                    errorMsg += `Tidak ada gambar buku yang terlampir\n`;
                }
            }

            if(errorMsg != ''){
                res.status(500).send(errorMsg);
                return;
            }
            

            //Interface
            interface UploadResult {
                secure_url: string
            }

            interface GambarBuku {
                buffer: Buffer
            }


            //Upload Sinopsis
            const validatorMsg: string = this.validateInputs(req);
            if(validatorMsg != ''){
                res.status(500).send(validatorMsg);
                return;
            }

            const unique_id = crypto.randomBytes(8).toString("hex");
            const nama_folder = 'forwistree/buku/'+nama.replace(/ /g,"_")+'_'+unique_id;
            const fileSinopsisBuffer = file_sinopsis[0].buffer;
            const uploadResult: UploadResult = await new Promise((resolve, reject) => {
                cloudinary.v2.uploader.upload_stream({folder: nama_folder+'/file_sinopsis'}, (error: UploadApiErrorResponse | undefined, uploadResult: UploadApiResponse | undefined) => {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(uploadResult as UploadResult);
                    }
                }).end(fileSinopsisBuffer);
            });
            const file_sinopsis_url = uploadResult.secure_url;


            //Insert Buku
            const objectId = new Types.ObjectId();
            const encryptedId = encryptString(objectId.toString());
            const kategoriId = decryptString(kategori);
            const kategoriObjectId = new Types.ObjectId(kategoriId);

            const newBukuObj = {
                _id: objectId,
                id: encryptedId,
                nama: nama,
                kategori: kategoriObjectId,
                file_sinopsis: file_sinopsis_url,
                added_by: new Types.ObjectId(), //Temporary Added By
                ...rest
            }

            const newBuku = await Buku.create(newBukuObj);


            //Insert buku to kategori array
            const kategoriRelationObj = await MasterKategori.findById({ _id: kategoriObjectId });
            kategoriRelationObj?.buku.push(newBukuObj);
            kategoriRelationObj?.save();


            //Upload Gambar Buku
            gambar_buku.forEach(async (gambar: GambarBuku) => {
                const uploadGambarResult: UploadResult = await new Promise((resolve, reject) => {
                    cloudinary.v2.uploader.upload_stream({folder: nama_folder+'/gambar_buku'}, (error: UploadApiErrorResponse | undefined, uploadResult: UploadApiResponse | undefined) => {
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
                    _id: gambarObjectId,
                    id: encryptedGambarId,
                    buku: objectId,
                    image: gambar_buku_url
                }
    
                await GambarBuku.create(newGambarBukuObj);
            });

            
            //Insert Penulis
            penulis_buku.forEach(async (penulis: string) => {
                const pivotPenulisBukuObjectId = new Types.ObjectId();
                const encryptedPenulisBukuId = encryptString(pivotPenulisBukuObjectId.toString());
                const decryptedPenulisId = decryptString(penulis);
                
                const newPivotPenulisBukuObj = {
                    _id: pivotPenulisBukuObjectId,
                    id: encryptedPenulisBukuId,
                    buku: objectId,
                    penulis: new Types.ObjectId(decryptedPenulisId)
                }
    
                await PivotPenulisBuku.create(newPivotPenulisBukuObj);
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
            //Declarations
            const { id } = req.params;
            const decryptedId = decryptString(id);

            const { 
                nama,
                kategori,
                penulis_buku,
                ...rest
            } = req.body;
            const { file_sinopsis, gambar_buku } = (req as any).files;

            const buku = await Buku.findById({ _id: decryptedId });
            const bukuId = buku?._id;

            if (!buku){
                res.status(500).send('Tidak ditemukan buku dengan id tersebut!');
                return;
            }
            

            //Validators
            if (Object.keys(req.body).length === 0){
                res.status(500).send('Belum ada data yang diinput');
                return;
            }

            const validatorMsg: string = this.validateInputs(req);
            if(validatorMsg != ''){
                res.status(500).send(validatorMsg);
                return;
            }

            
            //Interface
            interface UploadResult {
                secure_url: string
            }

            interface GambarBuku {
                buffer: Buffer
            }


            //Delete Sinopsis
            const file_sinopsis_url_db = buku.file_sinopsis;
            const parts = file_sinopsis_url_db.split('/');
            const index = parts.indexOf('forwistree');
            const extractedPart = parts.slice(index).join('/');
            const firstSlashIndex = extractedPart.indexOf('/');
            const secondSlashIndex = extractedPart.indexOf('/', firstSlashIndex + 1);
            const thirdSlashIndex = extractedPart.indexOf('/', secondSlashIndex + 1);
            const extractedPartFinal = extractedPart.substring(0, thirdSlashIndex);

            await new Promise((resolve, reject) => {
                cloudinary.v2.api.delete_resources_by_prefix(extractedPartFinal, (error: UploadApiErrorResponse | undefined, uploadResult: UploadApiResponse | undefined) => {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(uploadResult as UploadResult);
                    }
                });
            });
            await new Promise((resolve, reject) => {
                cloudinary.v2.api.delete_folder(extractedPartFinal, (error: UploadApiErrorResponse | undefined, uploadResult: UploadApiResponse | undefined) => {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(uploadResult as UploadResult);
                    }
                });
            });


            //Upload Sinopsis
            const unique_id = crypto.randomBytes(8).toString("hex");
            const nama_folder = 'forwistree/buku/'+nama.replace(/ /g,"_")+'_'+unique_id;
            const fileSinopsisBuffer = file_sinopsis[0].buffer;
            const uploadResult: UploadResult = await new Promise((resolve, reject) => {
                cloudinary.v2.uploader.upload_stream({folder: nama_folder+'/file_sinopsis'}, (error: UploadApiErrorResponse | undefined, uploadResult: UploadApiResponse | undefined) => {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(uploadResult as UploadResult);
                    }
                }).end(fileSinopsisBuffer);
            });
            const file_sinopsis_url = uploadResult.secure_url;


            //Update Buku
            const kategoriId = decryptString(kategori);
            const kategoriObjectId = new Types.ObjectId(kategoriId);

            const newBukuObj = {
                nama: nama,
                kategori: kategoriObjectId,
                file_sinopsis: file_sinopsis_url,
                added_by: new Types.ObjectId(), //Temporary Added By
                ...rest
            }
            
            const updatedBuku = await Buku.findByIdAndUpdate({ _id: decryptedId }, newBukuObj, { new: true });

            if(!updatedBuku){
                res.status(500).send('Tidak ditemukan buku dengan id tersebut!');
                return;
            }


            //Remove Old Relations
            const oldKategoriRelationObj = await MasterKategori.findById({ _id: buku.kategori._id });

            if(oldKategoriRelationObj){
                oldKategoriRelationObj.buku = oldKategoriRelationObj?.buku.filter(item => item.toString() !== bukuId?.toString())
                oldKategoriRelationObj?.save();
            }

            
            //Add relations
            const newKategoriRelationObj = await MasterKategori.findById({ _id: updatedBuku.kategori._id });
            
            if(newKategoriRelationObj){
                newKategoriRelationObj?.buku.push(updatedBuku._id);
                newKategoriRelationObj?.save();
            }


            //Upload Gambar Buku
            gambar_buku.forEach(async (gambar: GambarBuku) => {
                const uploadGambarResult: UploadResult = await new Promise((resolve, reject) => {
                    cloudinary.v2.uploader.upload_stream({folder: nama_folder+'/gambar_buku'}, (error: UploadApiErrorResponse | undefined, uploadResult: UploadApiResponse | undefined) => {
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
                    _id: gambarObjectId,
                    id: encryptedGambarId,
                    buku: buku._id,
                    image: gambar_buku_url
                }
    
                await GambarBuku.create(newGambarBukuObj);
            });
            

            //Insert Penulis
            penulis_buku.forEach(async (penulis: string) => {
                const pivotPenulisBukuObjectId = new Types.ObjectId();
                const encryptedPenulisBukuId = encryptString(pivotPenulisBukuObjectId.toString());
                const decryptedPenulisId = decryptString(penulis);
                
                const newPivotPenulisBukuObj = {
                    _id: pivotPenulisBukuObjectId,
                    id: encryptedPenulisBukuId,
                    buku: buku._id,
                    penulis: new Types.ObjectId(decryptedPenulisId)
                }
    
                await PivotPenulisBuku.create(newPivotPenulisBukuObj);
            });

            res.status(200).json({
                buku: buku,
                msg: "Berhasil"
            });
        } catch (error) {
            res.status(500).send("Terjadi kesalahan, error : " + JSON.stringify(error));
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

        interface GambarBuku {
            buffer: Buffer,
            mimetype: any
        }

        const { file_sinopsis, gambar_buku } = (req as any).files;

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

        if(file_sinopsis){
            const fileType = mime.contentType(file_sinopsis[0].mimetype);
            if(fileType != 'application/pdf'){
                errorMsg += 'File sinopsis harus file pdf';
                errorMsg += '\n';
            }

            if(file_sinopsis.length > 1){
                errorMsg += 'File sinopsis tidak boleh lebih dari 1';
                errorMsg += '\n';
            }
        }

        if(gambar_buku){
            let counter: number = 0;
            gambar_buku.forEach((gambar: GambarBuku) => {
                const fileType = mime.contentType(gambar.mimetype);

                if(fileType != 'image/jpeg' && fileType != 'image/webp' && fileType != 'image/png') counter++;
            });

            if(counter !== 0){
                errorMsg += 'Semua gambar buku yang terlampir harus berformat jpeg/png/webp';
                errorMsg += '\n';
            }

            if(gambar_buku.length > 5){
                errorMsg += 'Gambar buku tidak boleh lebih dari 5';
                errorMsg += '\n';
            }
        }

        return errorMsg;
    }
}

export const bukuController = new BukuController();