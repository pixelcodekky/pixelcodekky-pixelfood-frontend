export type User = {
    _id: string;
    email: string;
    name: string;
    city: string;
    country: string;
    addressLine1: string;
    countryCode: string;
    mobileNumber: string;
}

export type MenuItem = {
    _id: string;
    name: string;
    price: number;
}

export type Restaurant = {
    _id: string;
    user: string;
    restaurantName: string;
    city: string;
    country: string;
    deliveryPrice: number;
    estimatedDeliveryTime: number;
    cuisines: string[];
    menuItems: MenuItem[];
    imageUrl: string;
}

export type RestaurantSearchResponse = {
    data: Restaurant[],
    pagination: {
        total: number;
        page: number;
        pages: number;
    }
}

export type OrderStatus = "placed" | "paid" | "inProgress" | "outForDelivery" | "delivered"; 

export type Order = {
    _id?: string,
    restaurant: Restaurant
    user: User;
    cartItems: {
        menuItemId: string,
        name: string,
        quantity: number;
    }[],
    deliveryDetails: {
        name: string;
        addressLine1: string;
        city: string;
        email: string;
    },
    totalAmount:number;
    status: OrderStatus;
    createdAt: Date;
    restaurantId:string;
}

export interface ViewMapState {
    mapStyle: string;
    viewState: {
        latitude: number,
        longitude: number,
        zoom: number,
    }
};

export interface ShowonMap {
    current: boolean;
}

export type SearchState = {
    searchQuery: string;
    page:number;
    selectedCuisines: string[];
    sortOption: string;
}
