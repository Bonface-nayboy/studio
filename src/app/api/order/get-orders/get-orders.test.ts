import request from 'supertest';
import { createServer } from 'http';
import app from '@/app'; // Assuming your app is exported from here

describe('GET /api/order/get-orders', () => {
  let server;

  beforeAll(() => {
    server = createServer(app);
  });

  afterAll(() => {
    server.close();
  });

  it('should fetch orders successfully', async () => {
    const response = await request(server)
      .post('/api/order/get-orders')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        mobileNumber: '1234567890',
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach(order => {
      expect(order).toHaveProperty('orderId');
      expect(order).toHaveProperty('date');
      expect(order).toHaveProperty('total');
      expect(order).toHaveProperty('payment');
      expect(order).toHaveProperty('status');
      expect(order).toHaveProperty('items');
      order.items.forEach(item => {
        expect(item).toHaveProperty('productName');
        expect(item).toHaveProperty('quantity');
        expect(item).toHaveProperty('price');
        expect(item).toHaveProperty('subtotal');
      });
    });
  });

  it('should return 400 for missing required fields', async () => {
    const response = await request(server)
      .post('/api/order/get-orders')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });

  it('should handle server errors gracefully', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress error logs

    const response = await request(server)
      .post('/api/order/get-orders')
      .send({
        name: 'Invalid User',
        email: 'invalid@example.com',
        mobileNumber: '0000000000',
      });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal Server Error');

    console.error.mockRestore();
  });
});