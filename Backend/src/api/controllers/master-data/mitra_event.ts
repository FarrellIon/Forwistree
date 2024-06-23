import { Request, Response } from 'express';
import { Admins } from '../../database/schemas/admin/admins';
import { encryptString, decryptString } from '../../utils/encryption';
import { Types } from 'mongoose';
import validator from 'validator';
import crypto from 'crypto';
import cloudinary from '../../utils/cloudinary';
import mime from 'mime-types';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { MitraEvent } from '../../database/schemas/master_data/mitra_event';
import { Events } from '../../database/schemas/events/events';

class MitraEventController{
    get = async(req: Request, res: Response) => {
        try {
            const mitra = await MitraEvent.find({})
            .populate({
                path: 'pivot_mitra_event',
                select: 'mitra',
                populate: {
                    path: 'event',
                    select: 'judul'
                }
            })
            .sort('-createdAt');

            if (mitra?.length === 0) {
                res.status(500).send('Belum ada data mitra');
                return;
            }

            res.status(200).json({
                mitra,
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
            const mitra = await MitraEvent.findById({ _id: decryptedId });

            if (!mitra){
                res.status(500).send('Tidak ditemukan mitra dengan id tersebut');
                return;
            }

            res.status(200).json({
                mitra,
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
                ...rest
            } = req.body;
            const { gambar_mitra } = (req as any).files;

            const requiredFields = ['nama'];
            

            //Validators
            let errorMsg: string = '';
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    errorMsg += `Tidak ada ${field.replace(/_/g, ' ')}\n`;
                }
            }
            
            if(!gambar_mitra){
                errorMsg += `Tidak ada gambar mitra yang terlampir\n`;
            }

            if(errorMsg != ''){
                res.status(500).send(errorMsg);
                return;
            }
            

            //Interface
            interface UploadResult {
                secure_url: string
            }

            interface GambarMitra {
                buffer: Buffer
            }


            //Upload Sinopsis
            const validatorMsg: string = this.validateInputs(req);
            if(validatorMsg != ''){
                res.status(500).send(validatorMsg);
                return;
            }

            const unique_id = crypto.randomBytes(8).toString("hex");
            const nama_folder = 'forwistree/mitra-event/'+nama.replace(/ /g,"_")+'_'+unique_id;


            //Upload Gambar Event
            const gambar_mitra_array = Array.isArray(gambar_mitra) ? gambar_mitra : [gambar_mitra];
            gambar_mitra_array.forEach(async (gambar: GambarMitra, index: number) => {
                const uploadGambarResult: UploadResult = await new Promise((resolve, reject) => {
                    cloudinary.v2.uploader.upload_stream({folder: nama_folder}, (error: UploadApiErrorResponse | undefined, uploadResult: UploadApiResponse | undefined) => {
                        if (error) {
                            return reject(error);
                        } else {
                            return resolve(uploadResult as UploadResult);
                        }
                    }).end(gambar.buffer);
                });
                const gambar_mitra_url = uploadGambarResult.secure_url;


                //Insert Mitra Event
                const objectId = new Types.ObjectId();
                const encryptedId = encryptString(objectId.toString());
                const adminObjectId = (req.user! as any)._id;
    
                const newMitraObj = {
                    _id: objectId,
                    id: encryptedId,
                    nama: nama,
                    image: gambar_mitra_url,
                    added_by: adminObjectId,
                    ...rest
                }
    
                const newMitra = await MitraEvent.create(newMitraObj);
    
    
                //Insert admin relations
                const adminRelationObj = await Admins.findById({ _id: adminObjectId });
                if(adminRelationObj){
                    adminRelationObj.mitra_events.push(newMitraObj);
                    adminRelationObj.save();
                }else{
                    res.status(500).send('Relasi admin tidak ditemukan!');
                    return;
                }

                res.status(201).json({
                    buku: newMitra,
                    msg: "Berhasil"
                });
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
                ...rest
            } = req.body;
            const { gambar_mitra } = (req as any).files;

            const mitra = await MitraEvent.findById({ _id: decryptedId });
            const mitraId = mitra?._id;

            if (!mitra){
                res.status(500).send('Tidak ditemukan mitra dengan id tersebut!');
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

            interface GambarMitra {
                buffer: Buffer
            }


            //Delete Gambar Mitra
            const gambar_mitra_url_db = mitra.image;
            const parts = gambar_mitra_url_db.split('/');
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


            //Upload Gambar Mitra
            const unique_id = crypto.randomBytes(8).toString("hex");
            const nama_folder = 'forwistree/mitra-event/'+nama.replace(/ /g,"_")+'_'+unique_id;
            const gambar_mitra_array = Array.isArray(gambar_mitra) ? gambar_mitra : [gambar_mitra];
            gambar_mitra_array.forEach(async (gambar: GambarMitra, index: number) => {
                const uploadGambarResult: UploadResult = await new Promise((resolve, reject) => {
                    cloudinary.v2.uploader.upload_stream({folder: nama_folder}, (error: UploadApiErrorResponse | undefined, uploadResult: UploadApiResponse | undefined) => {
                        if (error) {
                            return reject(error);
                        } else {
                            return resolve(uploadResult as UploadResult);
                        }
                    }).end(gambar.buffer);
                });
                const gambar_mitra_url = uploadGambarResult.secure_url;
                

                //Update Mitra
                const newMitraObj = {
                    nama: nama,
                    image: gambar_mitra_url,
                    ...rest
                }
                
                const updatedMitra = await MitraEvent.findByIdAndUpdate({ _id: decryptedId }, newMitraObj, { new: true });

                if(!updatedMitra){
                    res.status(500).send('Tidak ditemukan mitra dengan id tersebut!');
                    return;
                }

                res.status(201).json({
                    buku: updatedMitra,
                    msg: "Berhasil"
                });
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
            const mitra = await MitraEvent.findByIdAndDelete({ _id: decryptedId });

            if (!mitra){
                res.status(500).send('Tidak ditemukan mitra dengan id tersebut!');
                return;
            }

            res.status(200).json({
                mitra,
                msg: "Berhasil"
            });
        } catch (error) {
            res.status(500).send("Terjadi kesalahan, error : " + error);
            return;
        }
    }

    validateInputs = (req: Request) => {
        let errorMsg: string = '';

        interface GambarMitra {
            buffer: Buffer,
            mimetype: any
        }

        const { gambar_mitra } = (req as any).files;

        if(req.body.nama){
            if (!validator.isAlphanumeric(req.body.nama, undefined, {ignore: ' -,&!.?'})){
                errorMsg += 'Nama mitra tidak valid';
                errorMsg += '\n';
            }

            if(!validator.isLength(req.body.nama, { min: 1, max: 50 })){    
                errorMsg += 'Nama mitra harus sepanjang 1-50 huruf';
                errorMsg += '\n';
            }
        }

        if(gambar_mitra){
            let counter: number = 0;
            const gambar_mitra_array = Array.isArray(gambar_mitra) ? gambar_mitra : [gambar_mitra];
            gambar_mitra_array.forEach((gambar: GambarMitra) => {
                const fileType = mime.contentType(gambar.mimetype);

                if(fileType != 'image/jpeg' && fileType != 'image/webp' && fileType != 'image/png') counter++;
            });

            if(counter !== 0){
                errorMsg += 'Semua gambar mitra yang terlampir harus berformat jpeg/png/webp';
                errorMsg += '\n';
            }

            if(gambar_mitra.length > 1){
                errorMsg += 'Gambar mitra hanya boleh 1';
                errorMsg += '\n';
            }
        }

        return errorMsg;
    }
}

export const mitraEventController = new MitraEventController();