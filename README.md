### Step 1: Set Up Your Project

1. **Initialize your project**:
   ```bash
   mkdir my-express-server
   cd my-express-server
   npm init -y
   ```

2. **Install dependencies**:
   ```bash
   npm install express mongoose dotenv
   npm install --save-dev typescript ts-node @types/node @types/express
   ```

3. **Initialize TypeScript**:
   ```bash
   npx tsc --init
   ```

### Step 2: Configure TypeScript

Edit the `tsconfig.json` file to include the following settings:
```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### Step 3: Create the Project Structure

Create the following folders and files:
```
src/
  ├── config/
  │   └── db.config.ts
  ├── models/
  │   └── user.model.ts
  ├── routes/
  │   └── user.routes.ts
  ├── app.ts
  └── server.ts
```

### Step 4: Configure MongoDB Connection

In `src/config/db.config.ts`:
```typescript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri:any = process.env.MONGODB_URI;


const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
```

### Step 5: Define a Mongoose Model

In `src/models/user.model.ts`:
```typescript
import { Schema, model } from 'mongoose';

interface IUser {
  name: string;
  email: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
}, {versionKey: false}); // versionKey: flase using do not allow to store __v field in mongodb for each records.

const User = model<IUser>('User', userSchema);

export default User;
```

### Step 6: Create Express Routes

In `src/routes/user.routes.ts`:
```typescript
import { Router } from 'express';
import User from '../models/user.model';

const router = Router();

router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
```

### Step 7: Set Up Express Application

In `src/app.ts`:
```typescript
import express from 'express';
import userRoutes from './routes/user.routes';

const app = express();

app.use(express.json());
app.use('/api', userRoutes);

export default app;
```

### Step 8: Start the Server

In `src/server.ts`:
```typescript
import app from './app';
import connectDB from './config/db.config';

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### Step 9: Add Environment Variables

Create a `.env` file in the root of your project:
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

### Step 10: Run the Server

Add the following script to your `package.json`:
```json
"scripts": {
  "start": "ts-node src/server.ts"
}
```

Then, start your server:
```bash
npm start
```

Your Node.js server using Express and TypeScript, connected to MongoDB, should now be up and running! You can test the endpoints using tools like Postman or curl.

Would you like any further details or assistance with this setup?


"scripts": {
    "build": "tsc",
    "start": "nodemon dist/server.js"
}


















Sure! Let's go through the steps to test your Node.js API using Jest and Supertest. We'll write tests for the endpoints we created earlier.

### Step 1: Install Testing Dependencies

First, install Jest and Supertest:
```bash
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

### Step 2: Configure Jest

Create a `jest.config.js` file in the root of your project:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
};
```

### Step 3: Create Test Files

Create a `__tests__` directory in the `src` folder and add a test file for your routes, e.g., `user.routes.test.ts`.

### Step 4: Write Tests

In `src/__tests__/user.routes.test.ts`:
```typescript
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/user.model';
import dotenv from 'dotenv';
dotenv.config();

const uri:any = process.env.MONGODB_URI;


beforeAll(async () => {
  await mongoose.connect(uri, {
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name', 'John Doe');
    expect(res.body).toHaveProperty('email', 'john@example.com');
  });

  it('should fetch all users', async () => {
    await User.create({ name: 'John Doe', email: 'john@example.com' });
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('name', 'John Doe');
    expect(res.body[0]).toHaveProperty('email', 'john@example.com');
  });
});
```

### Step 5: Add Test Script

Add the following script to your `package.json`:
```json
"scripts": {
  "test": "jest"
}
```

### Step 6: Run Tests

Run your tests using:
```bash
npm test
```

### Explanation

1. **Setup and Teardown**: The `beforeAll` hook connects to the MongoDB database before running any tests, and the `afterAll` hook closes the connection after all tests are done.
2. **Test Cases**: 
   - The first test case checks if a new user can be created successfully.
   - The second test case verifies if all users can be fetched correctly.
3. **Assertions**: We use Jest's `expect` function to assert the expected outcomes.

This setup ensures that your API endpoints are tested thoroughly. If you need more detailed tests or have specific scenarios in mind, feel free to ask!

Would you like to dive deeper into any specific part of this process?



