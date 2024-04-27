import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./layouts/layout";
import { HomePage } from "./pages/HomePage";
import { AuthCallbackpage } from "./pages/AuthCallbackpage";
import { UserProfilepage } from "./pages/UserProfilepage";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { ManageRestaurantPage } from "./pages/ManageRestaurantPage";
import { SearchPage } from "./pages/SearchPage/SearchPage";
import SearchPageLayout from "./pages/SearchPage/layout";

import DetailPage from "./pages/DetailPage";
import OrderStatusPage from "./pages/OrderStatusPage";


const AppRoutes = () => {
    return(
        <Routes>
            <Route path="/" element={<Layout showHero><HomePage/></Layout>} />
            <Route path='/auth_callback' element={<AuthCallbackpage/>} />
            <Route path='/search/:city' element={<SearchPageLayout showHero={false}><SearchPage /></SearchPageLayout> } />
            <Route path='/detail/:restaurantId' element={<Layout showHero={false}><DetailPage /></Layout> } />
            <Route element={<ProtectedRoute />}>
                <Route 
                    path="/order_status" 
                    element={ <Layout showHero={false}>
                        <OrderStatusPage /></Layout> } />
                <Route 
                    path="/user_profile" 
                    element={ <Layout showHero={false}>
                        <UserProfilepage /></Layout> } />
                <Route 
                    path="/manage_restaurant" 
                    element={ <Layout showHero={false}>
                        <ManageRestaurantPage /></Layout> } />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

export default AppRoutes;