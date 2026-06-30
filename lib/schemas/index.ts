import { z } from 'zod';

/** Portfolio item (product) creation/validation. */
export const productInsertSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Le prix doit être supérieur à 0'),
  currency: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  stock: z.coerce.number().int().optional(),
  image_url: z.string().optional(),
});
export type ProductInsert = z.infer<typeof productInsertSchema>;

/** Photographer profile fields a user may edit. */
export const profileSchema = z.object({
  full_name: z.string().optional(),
  phone: z.string().optional(),
  avatar_url: z.string().optional(),
  role: z.string().optional(),
});
export type ProfileUpdate = z.infer<typeof profileSchema>;

/** A chat message between two users, optionally about a product. */
export const messageSchema = z.object({
  content: z.string().min(1, 'Le message ne peut pas être vide'),
  receiver_id: z.string().min(1, 'Destinataire requis'),
  product_id: z.string().uuid().optional().nullable(),
});
export type MessageInsert = z.infer<typeof messageSchema>;

/** A booking/order created before redirecting to Stripe checkout. */
export const orderInsertSchema = z.object({
  buyer_id: z.string().min(1),
  seller_id: z.string().min(1),
  product_id: z.string().min(1),
  amount: z.coerce.number().positive(),
  currency: z.string().min(1),
});
export type OrderInsert = z.infer<typeof orderInsertSchema>;
