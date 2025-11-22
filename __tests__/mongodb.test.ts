describe('connectToDatabase configuration', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('should throw an error if MONGODB_URI is missing', async () => {
    const { MONGODB_URI, ...rest } = process.env;
    process.env = rest;

    await expect(import('../lib/mongodb')).rejects.toThrow(
      'Invalid or missing environment variable: "MONGODB_URI"',
    );
  });

  it('should reuse existing mongoose connection on subsequent calls', async () => {
    // Ensure MONGODB_URI is set so the module does not throw at import time.
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';

    // Reset module registry so we get a fresh instance of lib/mongodb for this test.
    jest.resetModules();

    const mongoose = await import('mongoose');
    const connectSpy = jest.spyOn(mongoose, 'connect').mockResolvedValue(
      mongoose as unknown as typeof import('mongoose'),
    );

    const { connectToDatabase } = await import('../lib/mongodb');

    const firstConn = await connectToDatabase();
    const secondConn = await connectToDatabase();

    // mongoose.connect should be called exactly once and the same connection instance reused.
    expect(connectSpy).toHaveBeenCalledTimes(1);
    expect(firstConn).toBe(secondConn);

    connectSpy.mockRestore();
  });
});
