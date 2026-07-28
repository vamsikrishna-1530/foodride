const { calculateDeliveryFee, calculateOrderPricing } = require('../utils/pricing');

describe('calculateDeliveryFee', () => {
  test('charges 40 for orders under 200', () => {
    expect(calculateDeliveryFee(150)).toBe(40);
  });

  test('charges 30 for orders from 200 up to 499', () => {
    expect(calculateDeliveryFee(200)).toBe(30);
    expect(calculateDeliveryFee(499)).toBe(30);
  });

  test('charges 20 for orders 500 and above', () => {
    expect(calculateDeliveryFee(500)).toBe(20);
  });
});

describe('calculateOrderPricing', () => {
  test('computes grand total as items + delivery fee + platform fee', () => {
    const result = calculateOrderPricing(300, 10);
    expect(result.deliveryFee).toBe(30);
    expect(result.platformFee).toBe(3);
    expect(result.grandTotal).toBe(300 + 30 + 3);
  });

  test('computes restaurant commission from percent', () => {
    const result = calculateOrderPricing(300, 10);
    expect(result.restaurantCommission).toBe(30);
  });

  test('delivery partner earning is delivery fee minus platform cut, floored at 0', () => {
    const result = calculateOrderPricing(100, 10);
    expect(result.deliveryPartnerEarning).toBe(30);
  });
});
