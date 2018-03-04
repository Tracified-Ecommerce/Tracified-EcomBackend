import { NextFunction, Request, Response, Router } from "express";
import { Error } from "mongoose";
import { IOrder } from "../../types/order/orderType";
import { IRequest } from "../../types/session/sessionType";
import { Helper, IHelper } from "../helpers/index";

const helper: IHelper = new Helper();
const router = Router();
const shopAdminAPI = helper.shopAdminAPI;

router.all("/*", (req: IRequest, res: Response, next: NextFunction) => {
    if (req.session && req.session.shop) {
        req.shopRequestHeaders = {
            "X-Shopify-Access-Token": req.session.shop.access_token,
        };
        next();
    } else {
        console.log("cookies disabled");
        res.send("cookies not found, Please try re-openning the app.");
    }
});

router.get("/products", (req: IRequest, res: Response) => {
    console.log("products");
    console.log(req.session.shop.name);
    console.log("shop request header : " + req.shopRequestHeaders);
    shopAdminAPI(
        "GET", req.session.shop.name, "/admin/products.json", req.shopRequestHeaders, null, (products: any) => {
        console.log("got products");
        res.status(200).send(products);
    });
});

router.get("/orders", (req: IRequest, res: Response) => {
    console.log("orders");
    shopAdminAPI("GET", req.session.shop.name, "/admin/orders.json", req.shopRequestHeaders, null, (orders: any) => {
        console.log("got orders");
        const unTracified = orders.orders.filter((order: IOrder) => {
            // let flag = false;
            let flag = true;
            order.note_attributes.map((noteAttrib: any) => {
                if (noteAttrib.name === "tracified" && noteAttrib.value === "true") {
                    flag = false;
                }
            });
            console.log("inside fulfilled function");
            return flag;
        });
        res.status(200).send({orders : unTracified});
    });
});

router.get("/fulfilled-orders", (req: IRequest, res: Response) => {
    console.log("fullfilled orders");
    const shopDomain = req.session.shop.name;
    shopAdminAPI(
        "GET", req.session.shop.name,
        "/admin/orders.json?status=any",
        req.shopRequestHeaders,
        null,
        (orders: any) => {
        const fulfilledOrders = orders.orders.filter((order: IOrder) => {
                let flag = false;
                order.note_attributes.map((noteAttrib: any) => {
                    if (noteAttrib.name === "tracified" && noteAttrib.value === "true") {
                        flag = true;
                    }
                });
                console.log("inside fulfilled function");
                return flag;
            });

        res.status(200).send({fulfilledOrders, shopDomain});
    });
});

router.get("/orders/:id/fulfill", (req: IRequest & Request, res: Response) => {
    const url: string = "/admin/orders/" + req.params.id + "/fulfillments.json";
    const body: object = {
        fulfillment: {
            notify_customer: true,
            tracking_number: null,
        },
      };
    shopAdminAPI("POST", req.session.shop.name, url , req.shopRequestHeaders, body, (fulfillment: any) => {
        console.log("order fulfilled");
        res.status(200).send(fulfillment);
    });
});

router.get("/orders/:id/tracify", (req: IRequest & Request, res: Response) => {
    const url: string = "/admin/orders/" + req.params.id + ".json";
    const body: object = {

            order: {
                id: req.params.id,
                note_attributes: {
                    tracified: true,
                },
            },
        };

    shopAdminAPI("PUT", req.session.shop.name, url , req.shopRequestHeaders, body, (order: any) => {
            console.log("order fulfilled");
            res.status(200).send(order);
        });
});

router.get("/item/:id", (req: IRequest & Request, res: Response) => {
    const url: string = "/admin/products/" + req.params.id + ".json";

    shopAdminAPI("GET", req.session.shop.name, url , req.shopRequestHeaders, null, (item: any) => {
        console.log("item request sent");
        res.status(200).send(item);
    });
});

export { router };
