import * as mongoose from "mongoose";

const ShopifyMappingSchema = new mongoose.Schema({
  mapping: Object,
  shop_name: String,
});

type ShopifyMappingModel = mongoose.Document & {
  shop_name: string,
  mapping: object,
};

const ShopifyMapping = mongoose.model("ShopifyMapping", ShopifyMappingSchema);
export {ShopifyMapping, ShopifyMappingModel};
