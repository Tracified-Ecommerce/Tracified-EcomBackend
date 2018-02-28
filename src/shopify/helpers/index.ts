    import * as crypto from "crypto";
    import querystring = require("querystring");
    import request = require("request-promise");

    export interface IHelper {
        verifyQueryHMAC(query: any, apiSecret: string): boolean;
        verifyPayloadHMAC(data: any, hmac: any, apiSecret: string, next: any): boolean;
        shopAdminAPI(
            method: string,
            shop: any,
            relUrl: string,
            shopRequestHeaders: any,
            body: any,
            callback: (obj: any) => any): any;
    }

    export class Helper implements IHelper {

    public verifyQueryHMAC(query: any, apiSecret: string) {
        if (!query.hmac) {
            return false;
        }
        const map = Object.assign({}, query);
        delete map.hmac;
        const message = querystring.stringify(map);
        const generatedHash = crypto
            .createHmac("sha256", apiSecret)
            .update(message)
            .digest("hex");

        return generatedHash !== query.hmac ? false : true;
    }

    public verifyPayloadHMAC(data: any, hmac: any, apiSecret: string, next: any) {
        data = JSON.stringify(data);
        const digest = crypto.createHmac("SHA256", apiSecret)
        .update(data)
        .digest("base64");
        console.log("digest");
        console.log(digest);
        console.log("hmac");
        console.log(hmac);
        return digest === hmac ? true : false;
    }

    public shopAdminAPI(
        method: string, shop: any, relUrl: string, shopRequestHeaders: any, body: any, callback: (obj: any) => any) {
        const options = {
            body,
            headers: shopRequestHeaders,
            json: true,
            method,
            uri: "https://" + shop + relUrl,
        };
        request(options).then(callback).catch((err: Error) => {
            return (err);
          } );
    }
}
