
import { z } from "zod";

export const messageSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "Message cannot be empty")
        .max(500, "Message cannot exceed 500 characters"),
});

