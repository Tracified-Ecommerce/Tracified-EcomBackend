import { NextFunction, Request, Response, Router } from "express";
import { Error } from "mongoose";
import { IRequest } from "../../types/session/sessionType";

import { IServices, Services } from "../../tracified/services";
import { Shop, ShopModel } from "../models/Shop";

const router = Router();

const tracifiedServices: IServices = new Services();

router.post("/account/verify", (req: IRequest & Request, res: Response) => {
    // tslint:disable-next-line:max-line-length
    tracifiedServices.verifyTracifiedAccount(req.body.tempToken, req.session.shop.name).then((data: any) => {
        // data = JSON.parse(data);
        console.log("tracified token is: " + data);
        const tracifiedToken = data;
        const shop = req.session.shop.name;

        // to use if a shop record is alredy there
        Shop.findOne({ name: shop }, "name access_token", (err: Error, installedShop: ShopModel) => {
            if (err) { return res.status(503).send("error with db connection. Plese try again in a while"); }
            if (installedShop) {
                installedShop.tracified_token = tracifiedToken;
                installedShop.save(() => {
                    if (err) { return res.status(503).send("error with db connection. Plese try again in a while"); }
                    return res.redirect("/shopify/main-view");
                });
            } else {
                return res.status(401).send("Account Verification Failed. Please try reinstalling the Plugin");
            }
        });
    }).catch((err: any) => {
        console.log("error is : " + err);
        return res.status(401).send("Account Verification Failed. Please try again!");
    });
});

export { router };
