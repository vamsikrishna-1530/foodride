// Central place for FoodRide's pricing rules. Kept intentionally low compared to
// typical aggregator fees, since being owner/delivery-partner friendly is a core
// product goal (see README).

const DELIVERY_PLATFORM_FEE = Number(process.env.DELIVERY_PLATFORM_FEE) || 10; // flat INR cut from delivery fee
const CUSTOMER_PLATFORM_FEE = Number(process.env.CUSTOMER_PLATFORM_FEE) || 3; // flat small fee shown to customer

const calculateDeliveryFee = (itemsTotal) => {
  // Simple distance-agnostic flat/graduated fee for demo purposes.
  if (itemsTotal >= 500) return 20;
  if (itemsTotal >= 200) return 30;
  return 40;
};

const calculateOrderPricing = (itemsTotal, restaurantCommissionPercent) => {
  const deliveryFee = calculateDeliveryFee(itemsTotal);
  const platformFee = CUSTOMER_PLATFORM_FEE;
  const deliveryPartnerEarning = Math.max(deliveryFee - DELIVERY_PLATFORM_FEE, 0);
  const restaurantCommission = Number(((itemsTotal * restaurantCommissionPercent) / 100).toFixed(2));
  const grandTotal = Number((itemsTotal + deliveryFee + platformFee).toFixed(2));

  return {
    itemsTotal: Number(itemsTotal.toFixed(2)),
    deliveryFee,
    platformFee,
    restaurantCommission,
    deliveryPartnerEarning,
    grandTotal,
  };
};

module.exports = { calculateOrderPricing, calculateDeliveryFee };
