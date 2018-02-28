import { NextFunction, Request, Response, Router } from "express";
import { Error } from "mongoose";
import { IServices, Services } from "../../tracified/services";
import { Imodal } from "../../types/modal/modalType";
import { IRequest } from "../../types/session/sessionType";
import { componentBuilder, dimensionBuilder, imageSliderBuilder, IImageSliderJSON, IDimensionJSON, IResponseJSON, mapBuilder } from "../helpers/modalBuilder";
import { Shop, ShopModel } from "../models/Shop";
import { ShopifyMapping, ShopifyMappingModel } from "../models/ShopifyMapping";

const router = Router();
const tracifiedServices: IServices = new Services();

router.all("/*", (req: IRequest & Request, res: Response, next: NextFunction) => {
    const re = /^\/(modal-mapping\/)[a-zA-Z0-9]+/;
    if (re.test(req.path)) {
        next();
    }
});

router.get("/modal-mapping/:shopname/:productID", (req: IRequest & Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const shopName = req.params.shopname;
    const product = req.params.productID;
    ShopifyMapping.findOne({ shop_name: shopName }, (err: Error, mapping: ShopifyMappingModel) => {
        if (err) {
            return res.status(503).send("error with db connection. Plese try again in a while");
        }
        if (mapping) {
            // mapping.mapping -> is the object with all the mapping
            if (mapping.mapping.hasOwnProperty(product)) {
                console.log("product has a mapping");
                const TracifiedID = mapping.mapping[product][0];
                Shop.findOne(
                    { name: shopName },
                    "name access_token tracified_token",
                    (errr: Error, exisitingShop: ShopModel) => {
                        if (err) {
                            return res.status(503).send("error with db connection. Plese try again in a while");
                        }
                        if (exisitingShop && exisitingShop.tracified_token) {
                            const tracifiedToken = exisitingShop.tracified_token;

                            tracifiedServices.getModalData(TracifiedID, tracifiedToken).then((data) => {
                                let componentArray = [];
                                let dimensionComponentArray = [];
                                let mapComponentArray = [];
                                // image slider
                                let imageSliderComponentArray = [];
                                componentArray = data.data[0].pointOfSale;
                                mapComponentArray = data.data[1].traceMore[0].map;
                                dimensionComponentArray = data.data[1].traceMore[1].dimensions;
                                // image slider
                                imageSliderComponentArray = data.data[2].images;

                                const responseJSON: IResponseJSON = {
                                    components: {
                                        htmltxt: "",
                                        pieChartData: [],
                                    },
                                    dimensionComponents: {
                                        htmltxt: "",
                                    },
                                    imageSliderComponents: {
                                        htmltxt: "",
                                    },
                                    mapComponents: {
                                        htmltabcontent: "",
                                        htmltabs: "",
                                        mapTabData: [],
                                    },
                                };
                                responseJSON.components = componentBuilder(componentArray);
                                responseJSON.dimensionComponents = dimensionBuilder(dimensionComponentArray);
                                responseJSON.imageSliderComponents = imageSliderBuilder(imageSliderComponentArray);
                                responseJSON.mapComponents = mapBuilder(mapComponentArray);
                                return res.send(responseJSON);
                            }); // TODO: catch error

                        } else {
                            return res.send("no shop in database");
                        }
                    });
            } else {
                console.log("no mapping for product");
                return res.status(404).send("item not found");
            }
        } else {
            return res.status(204).send("mapping not available");
        }

    });
});

export { router };
