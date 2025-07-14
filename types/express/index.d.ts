export {};
declare global {
  namespace Express {
    interface Request {
      user?: any; // أو النوع المناسب لليوزر عندك
    }
  }
}