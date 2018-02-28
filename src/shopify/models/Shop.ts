import * as mongoose from "mongoose";

const ShopSchema = new mongoose.Schema({
  access_token: String,
  name: String,
  tracified_token: String,
});

type ShopModel = mongoose.Document & {
  name: string,
  access_token: string | null,
  tracified_token: string | null,
};

const Shop = mongoose.model("Shop", ShopSchema);
export {Shop, ShopModel};
