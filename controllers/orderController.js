import Order from "../models/order.js";
export function createOrder(req, res) {

    if (req.user == null) {
        res.status(403).json({
            message: "Please login before creating an order"
        })
        return;
    }

    const body = req.body;
    const orderData = {
        orderId: "",
        email: req.user.email,
        name: body.name,
        address: body.address,
        phoneNumber: body.phoneNumber,
        billItems: [],
        total: 0,
    }

    Order.find().sort({
        date: -1,

    })
        .limit(1).then((lastBills) => {
            if (lastBills.length == 0) {
                orderData.orderId = "ORD0001";
            } else {
                const lastBill = lastBills[0];

                const lastOrderId = lastBill.orderId; //ord6361
                const lastOrderNumber = lastOrderId.replace("ORD", "");  //6361
                const lastOrderNumberInt = parseInt(lastOrderNumber); //6361
                const newOrderNumberInt = lastOrderNumberInt + 1; //6362
                const newOrderNumberStr = newOrderNumberInt.toString().padStart(4, "0"); //ORD6362   
                orderData.orderId = "ORD" + newOrderNumberStr;

            }

            const order = new Order(orderData);

            order.save().then(() => {
                res.json({ message: "Order created" });
            }).catch((err) => {
                console.log(err);
                res.status(500).json({ message: "Error creating order" });
            });

        });


}

export function getOrders(req, res) {
    if (req.user == null) {
        res.status(403).json({
            message: "Please login before getting orders"
        })
        return;
    }
    if (req.user.role == "admin")
        Order.find().then(
            (orders) => {
                res.json(orders);
            }).catch((err) => {
                console.log(err);
                res.status(500).json({ message: "Error getting orders" });
            })
    else {
        Order.find({ email: req.user.email }).then((orders) => {
            res.json(orders);
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Error getting orders" });
        })
    }
}
