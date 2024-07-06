import { useCreateMyRestaurant, useGetMyRestaurant, useGetMyRestaurantOrders, useUpdateRestaurant } from '@/api/MyRestaurantApi'
import OrderItemCard from '@/components/OrderItemCard';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import ManageRestaurantForm from '@/forms/manage_restaurant_form/ManageRestaurantForm'

export const ManageRestaurantPage = () => {
  const {createRestaurant, isLoading: createLoading} = useCreateMyRestaurant();
  const { restaurant } = useGetMyRestaurant();
  const { updateRestaurant, isLoading: updateLoading } = useUpdateRestaurant();
  const {orders, isLoading: ordersLoading} = useGetMyRestaurantOrders();

  const isEditing = !!restaurant;

    return (
      <Tabs defaultValue='orders'>
        <TabsList>
          <TabsTrigger value='orders'>Order</TabsTrigger>
          <TabsTrigger value='manage_restaurant'>Manage Restaurant</TabsTrigger>
        </TabsList>

        <TabsContent value='orders' className='space-y-5 bg-gray-50 rounded-lg'>
          <h2 className='text-2xl font-bold '>{orders?.length} active orders</h2>
          {!ordersLoading && orders?.map((order,index) => (
            <OrderItemCard key={index} order={order} />
          ))}
        </TabsContent>
        <TabsContent value='manage_restaurant' className='space-y-5 bg-gray-50 rounded-lg'>
          <ManageRestaurantForm 
          restaurant={restaurant} 
          onSave={isEditing ? updateRestaurant : createRestaurant} 
          isLoading={createLoading || updateLoading}/>
        </TabsContent>

      </Tabs>

      
      
    );
}
