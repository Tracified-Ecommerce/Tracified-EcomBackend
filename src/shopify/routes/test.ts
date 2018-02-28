import { Request, Response, Router } from "express";
import { Error } from "mongoose";
import { IServices, Services } from "../../tracified/services";
import { IRequest } from "../../types/session/sessionType";
import { Helper, IHelper } from "../helpers/index";

const router = Router();
const crypto = require("crypto");
const cookie = require("cookie");
const nonce = require("nonce")();
const querystring = require("querystring");
const request = require("request-promise");
const Shop = require("../models/Shop");
const scopes = "write_products,write_themes,write_orders,read_orders";
const forwardingAddress = "https://shopify-tracified.herokuapp.com";
const apiKey = "7f3bc78eabe74bdca213aceb9cfcc1f4";
const apiSecret = "d3141aefd842b5857b2048a3a229f4c8";

const services: IServices = new Services();
const helper: IHelper = new Helper();
const shopAdminAPI = helper.shopAdminAPI;
const verifyQueryHMAC = helper.verifyQueryHMAC;
const verifyPayloadHMAC = helper.verifyPayloadHMAC;
const getTracifiedItemList = services.getTracifiedItemList;
const getOrderTraceabilityData = services.getOrderItemTraceabilityData;

router.post("/webhook", (req: Request, res: Response) => {
    console.log(req.get("X-Shopify-Hmac-Sha256"));
    console.log(req.get("X-Shopify-Shop-Domain"));
    if (req.get("X-Shopify-Hmac-Sha256") && req.body) {

        if (verifyPayloadHMAC(req.body, req.get("X-Shopify-Hmac-Sha256"), apiSecret, null)) {
            return res.status(200).send("Webhook Verified!");
        }
        return res.status(401).send("Unauthorized Webhook Request! HMAC verification fails");
    }

    return res.status(401).send("Unauthorized Webhook Request! body or HMAC header missing.");
});

router.get("/api", (req: Request, res: Response) => {
    res.send({ message: "Tracified/Shopify API can be used" });
});

router.get("/services/item-list", (req: Request, res: Response) => {

    getTracifiedItemList(null).then((data: any) => {
        console.log(data);
        return res.send(data);
    }).catch((err: Error) => {
        return err;
    });
});

// router.get("/services/order-details", (req: Request, res: Response) => {

//     getOrderTraceabilityData().then((data: any) => {
//         console.log(data);
//         return res.send(data);
//     }).catch((err: Error) => {
//         return err;
//     });
// });

router.get("/shop-link", (req: IRequest, res: Response) => {
    console.log("cookie-checking");
    console.log(req.session);
    if (req.session && req.session.shop) {
        console.log("cookie");
        console.log(req.session.shop);
        console.log(req.session.shop.name);
        res.render("about.html");
    }
});

router.get("/set-cookie", (req: IRequest, res: Response) => {
    req.session.test = { test: "cookie" };
    return res.redirect("/test/test-cookie");
});

router.get("/test-cookie", (req: IRequest, res: Response) => {
    if (req.session && req.session.test) {
        console.log("cookie enabled");
        console.log(req.session.test);
        res.send("cookie enabled");
    } else {
        console.log("cookie enabled");
        console.log(req.session.test);
        // tslint:disable-next-line:max-line-length
        res.send("cookie disabled, You need to enable browser cookie to use the plugin without interruptions. Please enable cookies and retry.");
    }
});

router.get("/route-check", (req: Request, res: Response) => {
    return res.send("Route check successful");
});

export { router };

        // if (mapping && Object.keys(mapping).length) {
        //     return
        // } else {
        // }
