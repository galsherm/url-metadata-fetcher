import request from 'supertest';
import app from '../app.js';
describe("POST /fetch-metadata", () => {

  describe("given valid URLs", () => {
    test("should respond with a 200 status code", async () => {
      const urls = ['https://www.walla.co.il', 'https://www.walla.co.il'];
      const response = await request(app).post("/fetch-metadata").send({ urls });
      expect(response.statusCode).toBe(200);
    });

    test("should respond with an array of metadata", async () => {
      const urls = ['https://www.walla.co.il', 'https://www.walla.co.il'];
      const response = await request(app).post("/fetch-metadata").send({ urls });
      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach((metadata) => {
        expect(metadata).toHaveProperty('url');
        expect(metadata).toHaveProperty('title');
        expect(metadata).toHaveProperty('description');
        expect(metadata).toHaveProperty('image');
      });
    });
  });

  describe("when no URLs are provided", () => {
    test("should respond with a status code of 400", async () => {
      const response = await request(app).post("/fetch-metadata").send({ urls: [] });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('No URLs provided');
    });
  });

  describe("when an invalid URL is provided", () => {
    test("should respond with a status code of 200 and metadata with error status", async () => {
      const urls = ['https://invalid.url.example']; // Use an invalid or unreachable URL
      const response = await request(app).post("/fetch-metadata").send({ urls });
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach((metadata) => {
        expect(metadata).toHaveProperty('url', 'https://invalid.url.example');
        expect(metadata).toHaveProperty('title', 'Error');
        expect(metadata).toHaveProperty('description', 'Failed to fetch metadata');
        expect(metadata).toHaveProperty('image', 'https://via.placeholder.com/150');
      });
    });
  });


  describe("rate limiting", () => {
    test("should limit requests to 5 per second", async () => {
      const urls = ['https://www.walla.co.il'];

      // Function to delay execution
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(1000); // Ensure the delay before starting the test

      // Perform 6 requests in quick succession
      const responses = [];
      for (let i = 0; i < 6; i++) {
        const response = await request(app).post("/fetch-metadata").send({ urls });
        responses.push(response);
        console.log("response " + "i_" + i + "_" + response.statusCode);
        //await delay(50); 
      }

      // Check responses for rate limiting behavior
      responses.forEach((response, index) => {
        if (index < 5) {
          // Expect the first 5 requests to succeed
          expect(response.statusCode).toBe(200);
        } else {
          // Expect the 6th request to be rate-limited
          expect(response.statusCode).toBe(429); // 429 Too Many Requests
        }
      });
    });
  });
});

