// controllers/orderController.js
import Cart from "../Models/CartMd.js";
import Discount from "../Models/DiscountCodeMd.js";
import Order from "../models/Order.js";
import ProductVariant from "../Models/ProductVariantMd.js";
import {
  createPayment,
  verifyPayment,
  ZARINPAL,
} from "../Service/ZarinpalService.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import { checkCode } from "./DiscountCodeCn.js";

// Create new order
export const createOrder = catchAsync(async (req, res, next) => {
  const userId = req?.userId;
  const { code = null } = req?.body;
  const cart = await Cart.findOne({ userId });
  if (!cart || !cart.items.length) {
    return next(new HandleERROR("Cart is empty", 400));
  }

  let confirmDiscount;
  if (code) {
    confirmDiscount = await Discount.findOne({ code });
    const resultCode = checkCode(code, cart?.totalPrice, userId);
    if (!resultCode.success) {
      return next(new HandleERROR(resultCode.error, 400));
    }
  }

  let newTotalPrice = 0;
  let change = false;
  let newItems = [];

  for (let item of cart?.items) {
    const pv = await ProductVariant.findById(item.productVariantId);
    if (!pv) continue;
    if (pv.quantity < item.quantity) {
      item.quantity = pv.quantity;
      change = true;
    }
    item.finalPrice = pv.priceAfterDiscount;
    newTotalPrice += item.quantity * item.finalPrice;
    newItems.push(item);
  }

  if (newTotalPrice != cart.totalPrice) {
    change = true;
  }

  if (change) {
    cart.items = newItems;
    cart.totalPrice = newTotalPrice;
    const newCart = await cart.save();
    return res.status(400).json({
      success: false,
      data: newCart,
    });
  }

  let newTotalPriceAfterDiscount = newTotalPrice;
  if (confirmDiscount) {
    discountAmount =
      (confirmDiscount.maxPrice
        ? confirmDiscount.maxPrice >= newTotalPrice
          ? confirmDiscount.maxPrice * confirmDiscount.percent
          : newTotalPrice * confirmDiscount.percent
        : newTotalPrice * confirmDiscount.percent) / 100;
    newTotalPriceAfterDiscount -= discountAmount;
  }

  const payloadOrder = {
    userId,
    addressId,
    items: newItems,
    totalPrice: newTotalPrice,
    totalPriceAfterDiscount: newTotalPriceAfterDiscount,
  };
  if (confirmDiscount) {
    payloadOrder.discountId = confirmDiscount._id;
  }
  const newOrder = await Order.create(payloadOrder);

  const payment = await createPayment(
    newTotalPriceAfterDiscount,
    `Rokad E-Commerce GATEWAY`,
    newOrder._id
  );

  if (payment.data && payment.data.code === 100) {
    newOrder.authority = payment.data.authority;
    await newOrder.save();
    if (confirmDiscount) {
      confirmDiscount.userIdsUsed.push(userId);
      await confirmDiscount.save();
    }
    return res.status(200).json({
      success: true,
      url: `${ZARINPAL.GATEWAY}${payment.data.authority}`,
    });
  }
});

export const getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new HandleERROR("Order not found", 404));
  return res.status(200).json(order);
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Order, req.query, req.role)
    .addManualFilters(
      req?.role != "admin" && req?.role != "superAdmin"
        ? { userId: req.userId }
        : null
    )
    .filter()
    .sort()
    .paginate()
    .populate()
    .limitFields();
  const date = await features.execute();
  return res.status(200).json(data);
});

export const zarinpalCallback = catchAsync(async (req, res, next) => {
  const { Authority, orderId } = req.query;
  const order = await Order.findById(orderId);
  if (!order) return next(new HandleERROR("Order not found", 404));
  const amount = order.totalPriceAfterDiscount || order.totalPrice;
  const result = await verifyPayment(amount, Authority);
  if (result.data && result.data.code === 100 && result.data.ref_id) {
    order.status = "success";
    order.refId = result.data.ref_id;
    await order.save();
    return res.redirect(
      `${process.env.CLIENT_URL}/payment-success?ref=${result.data.ref_id}`
    );
  }
  order.status = "failed";
  await order.save();
  return res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
});
