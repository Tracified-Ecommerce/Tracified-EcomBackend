import { Request, Response, Router } from "express";
const router = Router();

// shopify admin-links has to be decided and implemented. this is only a test route
router.get("/order-trace", (req: Request, res: Response) => {
    res.send({
        "Data": "No Tracified Data Found",
        "Order id": req.query.id,
        "Shop": req.query.shop,
    });
});

export { router };
