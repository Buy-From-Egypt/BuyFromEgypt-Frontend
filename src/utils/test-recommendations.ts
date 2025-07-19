// Test file to validate recommendations API integration
import { useGetProductRecommendationsByUserIdQuery } from "@/store/apis/recommendations";

// Example usage:
const testUserId = "af1fbe8a-2d20-4a42-803a-e7f95af2af8b";

// This would be used in a component like:
/*
const { data, isLoading, error } = useGetProductRecommendationsByUserIdQuery({
  userId: testUserId,
  num_recommendations: 10
});

if (isLoading) console.log("Loading recommendations...");
if (error) console.log("Error loading recommendations:", error);
if (data) console.log("Recommendations data:", data);
*/

export { testUserId };
