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



const phoneValidation = /^[89][0-9]{7}$/ //new RegExp();
export const CheckoutAddressFormSchema = z.object({
    email: z.string().optional(),
    name: z.string({required_error: "required"})
            .refine((value) => value !== "", {message: "required"}),
    mobileNumber: z.number({required_error: "required."})
                    .refine((value) => phoneValidation.test(value.toString()), {message: "Invalid Phone Number"})
                    .refine((value) => value.toString().length === 8, "Phone Number must be 8 digit long."),
    countryCode: z.string({required_error: "Country Code required."})
                .refine((value) => value !== "NA", {message: "Please select Country Code"} ),
    buildingName: z.string().optional(),
    floor: z.string().optional(),
    unitNumber: z.string().optional(),
    deliveryInstruction: z.string({required_error: "required"}),
    fullName: z.string().optional(),
});

export type CheckoutAddressFormData = z.infer<typeof CheckoutAddressFormSchema>;

