import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { LoadingButton } from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-separator';
import { CuisinesSection } from './CuisinesSection';
import MenuSection from './MenuSection';
import ImageSection from './ImageSection';
import DetailsSection from './DetailsSection';
import { Restaurant } from '@/types';
import { useEffect } from 'react';
import { toast } from 'sonner';

const formSchema = z.object({
    restaurantName: z.string({
        required_error:  "Please enter a name for the restaurant.",
    }),
    city: z.string({
        required_error:  "Please enter a name for the City.",
    }),
    country: z.string({
        required_error:  "Please enter a name for the country.",
    }),
    deliveryPrice: z.coerce.number({
        required_error: "delivery price is required",
        invalid_type_error: "must be a valid number",
    }),
    estimatedDeliveryTime: z.coerce.number({
        required_error: "estimated delivery time is required",
        invalid_type_error: "must be a valid number",
    }),
    cuisines: z.array(z.string()).nonempty({
        message: 'Please select at least one item',
    }),
    menuItems: z.array(
        z.object({
        name: z.string().min(1, 'name is required'),
        price: z.coerce.number().min(1, 'price is required'),
    })),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, {message: 'image is required'}).optional(),
}).refine((data) => data.imageUrl || data.imageFile, {
    message: 'Either an image URL or image File must be provided',
    path: ['imageFile']
})

type RestaurantFormData = z.infer<typeof formSchema>

type Props = {
    restaurant?: Restaurant;
    onSave: (restaurantFormData: FormData) => void;
    isLoading: boolean;
}

const ManageRestaurantForm = ({ restaurant ,onSave, isLoading }: Props ) => {
    const form = useForm<RestaurantFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cuisines: [],
            menuItems: [{name: '', price: 0}],
        },
    });

    useEffect(() => {
        if (!restaurant) return;

        const deliveryPriceMap = parseInt(
            (restaurant.deliveryPrice / 100).toFixed(2)
        );

        const menuItemMap = restaurant.menuItems.map((item) => ({
            ...item, 
            price: parseInt((item.price / 100).toFixed(2)),
        }));

        const restaurantMap = {
            ...restaurant,
            deliveryPrice: deliveryPriceMap,
            menuItems: menuItemMap,
        };

        form.reset(restaurantMap);

    },[restaurant]);

    const onSubmit = (formDataJson: RestaurantFormData) => {
        const formData = new FormData();
    
        formData.append("restaurantName", formDataJson.restaurantName);
        formData.append("city", formDataJson.city);
        formData.append("country", formDataJson.country);
    
        formData.append(
          "deliveryPrice",
          (formDataJson.deliveryPrice * 100).toString()
        );
        formData.append(
          "estimatedDeliveryTime",
          formDataJson.estimatedDeliveryTime.toString()
        );
        formDataJson.cuisines.forEach((cuisine, index) => {
          formData.append(`cuisines[${index}]`, cuisine);
        });
        formDataJson.menuItems.forEach((menuItem, index) => {
          formData.append(`menuItems[${index}][name]`, menuItem.name);
          formData.append(
            `menuItems[${index}][price]`,
            (menuItem.price * 100).toString()
          );
        });
    
        if (formDataJson.imageFile) {
          formData.append(`imageFile`, formDataJson.imageFile);
        }
    
        onSave(formData);
      };

      const onInvalid = (errors: any) => {
        console.log(errors);
        toast.error(`Something went wrong, please try again.`);
      }

    return (
        <>
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit, onInvalid)} 
                    className='space-y-4 bg-gray-50 rounded-lg md:p-10'>
                    <DetailsSection />
                    <Separator />
                    <CuisinesSection />
                    <Separator />
                    <MenuSection />
                    <Separator />
                    <ImageSection />
                    {isLoading ? <LoadingButton /> : <Button type='submit' className='bg-green-600'>Submit</Button>}
                </form>
            </Form>
        </>
        
    )
}

export default ManageRestaurantForm;
