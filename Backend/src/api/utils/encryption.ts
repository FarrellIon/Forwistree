import crypto from 'crypto'

export function encryptString(string: string) {
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(process.env.ENCRYPTION_KEY!),
        iv
    );

    let encrypted = cipher.update(string);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decryptString(encryptedString: string) {
    try{
        let textParts = encryptedString.split(":");
        let iv = Buffer.from(textParts.shift()!, "hex");
        let encryptedText = Buffer.from(textParts.join(":"), "hex");
        let decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            Buffer.from(process.env.ENCRYPTION_KEY!),
            iv
        );
    
        let decrypted = decipher.update(encryptedText);
    
        decrypted = Buffer.concat([decrypted, decipher.final()]);
    
        return decrypted.toString()
    }catch(e: any){
        throw new Error(e);
    }
}