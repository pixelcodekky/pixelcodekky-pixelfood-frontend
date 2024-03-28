import { useCreateMyRestaurant, useGetMyRestaurant, useUpdateRestaurant } from '@/api/MyRestaurantApi'
import ManageRestaurantForm from '@/forms/manage_restaurant_form/ManageRestaurantForm'

export const ManageRestaurantPage = () => {
  const {createRestaurant, isLoading: createLoading} = useCreateMyRestaurant();
  const { restaurant } = useGetMyRestaurant();
  const { updateRestaurant, isLoading: updateLoading } = useUpdateRestaurant();

  const isEditing = !!restaurant;

  return (
    <ManageRestaurantForm 
      restaurant={restaurant} 
      onSave={isEditing ? updateRestaurant : createRestaurant} 
      isLoading={createLoading || updateLoading}/>
  )
}
