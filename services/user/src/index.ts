import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import userRoutes from "./routes/user-routes";
import authRoutes from "./routes/auth-routes";

// Custom Error Interface to add status property
interface CustomError extends Error {
  status?: number;
}

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"], // Allowed methods
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ], // Allowed headers
  })
);

// Route handling
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

// Root route
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log("Sending Greetings!");
  res.json({
    message: "Hello World from user-service",
  });
});

// Handle when no route matches
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: CustomError = new Error("Route Not Found");
  error.status = 404;
  next(error);
});

// Error handling middleware
app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  }
);

export default app;
