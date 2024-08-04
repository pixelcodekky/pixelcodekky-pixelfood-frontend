import { z } from 'zod';


export const AddressDetailsFormSchema = z.object({
    buildingName: z.string().optional(),
    floor: z.string().optional(),
    unitNumber: z.string().optional(),
    deliveryInstruction: z.string().optional(),
    addressName: z.string({
        required_error: "Required"
    }),
    fullName: z.string().optional()
});

export type AddressDetailsFormData = z.infer<typeof AddressDetailsFormSchema>;

