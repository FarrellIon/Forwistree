import { Admins } from "../database/schemas/admin/admins";
import { decryptString } from "../utils/encryption";
import { Request, Response } from "express";

export function ensureAuthenticated(req: Request, res: Response, next: () => any) {
    if (req.isAuthenticated() || req.headers.uservalue != 'undefined') {
        if(req.isAuthenticated()){
            return next();
        }
        if(req.headers.uservalue != 'undefined'){
            const admin = Admins.findById({ id: decryptString((req.headers.uservalue as string).replace(/%3A/g, ':')) });

            if(!admin){
                res.status(400).send('User tidak ditemukan');
            }
        }
        return next();
    }else{
        res.status(400).send('Belum login');
    }
}