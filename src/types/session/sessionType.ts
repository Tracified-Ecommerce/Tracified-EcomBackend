import { Request } from "express";

export interface IRequest extends Request {
  session: ISession;
  shopRequestHeaders: any;
}

interface ISession {
  shop: IShop;
  test: any;
}

interface IShop {
  name: any;
  tracified_token: any;
  access_token: any;
}

interface IBody {
  tempToken: any;
  mapping: any;
}

interface IParams {
  orderID: any;
  itemID: any;
  id: any;
}
