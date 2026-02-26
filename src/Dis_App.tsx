import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./admin/pages/AuthPages/SignIn";
import ForgetPassword from "./admin/pages/AuthPages/ForgetPassword";


// Admin Pages
import ManageAdmin from "./admin/pages/Admin/ManageAdmin";
import EditAdmin from "./admin/pages/Admin/EditAdmin";
import CreateAdmin from "./admin/pages/Admin/CreateAdmin";



// Vendor Pages
import ManageVendors from "./admin/pages/Vendor/ManageVendors";
import ViewVendor from "./admin/pages/Vendor/ViewVendor";

// User Pages
import ManageUsers from "./admin/pages/Users/ManageUsers";
import ViewUser from "./admin/pages/Users/ViewUser.tsx";

import UsersReviews from "./admin/pages/Users/UsersReviews";
import ViewReview from "./admin/pages/Users/ViewReview";


// Listing Pages
import PendingHotels from "./admin/pages/Listings/PendingHotels";
import ViewPendingHotel from "./admin/pages/Listings/ViewPendingHotel";
import ApprovedHotels from "./admin/pages/Listings/ApprovedHotels";
import ViewApprovedHotel from "./admin/pages/Listings/ViewApprovedHotel";
import RejectedHotels from "./admin/pages/Listings/RejectedHotels";
import ViewRejectedHotel from "./admin/pages/Listings/ViewRejectedHotel";

import PendingAdventures from "./admin/pages/Listings/PendingAdventures";
import ViewPendingAdventure from "./admin/pages/Listings/ViewPendingAdventure";
import ApprovedAdventures from "./admin/pages/Listings/ApprovedAdventures";
import ViewApprovedAdventure from "./admin/pages/Listings/ViewApprovedAdventure";
import RejectedAdventures from "./admin/pages/Listings/RejectedAdventures";
import ViewRejectedAdventure from "./admin/pages/Listings/ViewRejectedAdventure";


// Booking Pages
import Bookings from "./admin/pages/Bookings/Bookings";
import ViewBooking from "./admin/pages/Bookings/ViewBooking";
import UpcomingBookings from "./admin/pages/Bookings/UpcomingBookings";
import CompletedBookings from "./admin/pages/Bookings/CompletedBookings";
import CancelledBookings from "./admin/pages/Bookings/CancelledBookings";



// Payment Pages
import Payments from "./admin/pages/Payments/Payments";
import FinanceCommissions from "./admin/pages/Payments/FinanceCommissions"; 
import FinancePayouts from "./admin/pages/Payments/FinancePayouts";
import FinanceInvoice from "./admin/pages/Payments/FinanceInvoice";
import ViewFinanceInvoice from "./admin/pages/Payments/ViewFinanceInvoice";

// CMS Pages
import StaticPages from "./admin/pages/CMS/StaticPages";
import EditPage from "./admin/pages/CMS/EditPage";
import HomepageBanners from "./admin/pages/CMS/HomepageBanners";
import BlogManagement from "./admin/pages/CMS/BlogManagement";


import SignUp from "./admin/pages/AuthPages/SignUp";
import AppLayout from "./admin/layout/AppLayout";
import { ScrollToTop } from "./admin/components/common/ScrollToTop";
import Home from "./admin/pages/Dashboard/Home.tsx";
import Profile from "./admin/pages/Profile";
import Notifications from "./admin/pages/Notifications";




export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/dashboard" element={<Home />} />
            <Route index path="/profile" element={<Profile />} />
            <Route index path="/notifications" element={<Notifications />} />
           
            {/* Admin */}
            <Route path="/admins" element={<ManageAdmin />} />
            <Route path="/admin/edit/:id" element={<EditAdmin />} />
            <Route path="/admins/create" element={<CreateAdmin />} />


            {/* Vendors */}
            <Route path="/vendors" element={<ManageVendors />} />
            <Route path="/vendors/view/:id" element={<ViewVendor />} />


            {/* Users */}
            <Route path="/users" element={<ManageUsers />} />
            <Route path="/users/:id" element={<ViewUser />} />

            <Route path="/users/reviews" element={<UsersReviews />} />
            <Route path="/admin/reviews/:id" element={<ViewReview />} />


            {/* Hotels */}
            <Route path="/hotels/pending" element={<PendingHotels />} />
            <Route path="/hotels/pending/view/:id" element={<ViewPendingHotel />} />
            <Route path="/hotels/approved" element={<ApprovedHotels />} />
            <Route path="/hotels/approved/view/:id" element={<ViewApprovedHotel />} />
            <Route path="/hotels/rejected" element={<RejectedHotels />} />
            <Route path="/hotels/rejected/view/:id" element={<ViewRejectedHotel />} />


            {/* Adventures */}
            <Route path="/adventures/pending" element={<PendingAdventures />} />
             <Route path="/adventures/pending/view/:id" element={<ViewPendingAdventure />} />
            <Route path="/adventures/approved" element={<ApprovedAdventures />} />
            <Route path="/adventures/approved/view/:id" element={<ViewApprovedAdventure />} />
            <Route path="/adventures/rejected" element={<RejectedAdventures />} />
            <Route path="/adventures/rejected/view/:id" element={<ViewRejectedAdventure />} />


            {/* Booking */}
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/view/:id" element={<ViewBooking />} />
            <Route path="/bookings/upcoming" element={<UpcomingBookings />} />
            <Route path="/bookings/completed" element={<CompletedBookings />} />
            <Route path="/bookings/cancelled" element={<CancelledBookings />} />


            {/* Payments */}
            <Route path="/payments" element={<Payments />} />
            <Route path="/finance/commissions" element={<FinanceCommissions />} />
            <Route path="/finance/payouts" element={<FinancePayouts />} />
            <Route path="/finance/invoices" element={<FinanceInvoice />} />
            <Route path="/finance/invoices/view/:id" element={<ViewFinanceInvoice />} />



            {/* CMS Routes */}
            <Route path="/cms/pages" element={<StaticPages />} />
            <Route path="/cms/pages/edit/:slug" element={<EditPage />} />
            <Route path="/cms/banners" element={<HomepageBanners />} />
            <Route path="/cms/blogs" element={<BlogManagement />} />



       
          </Route>

          {/* Auth Layout */}
          <Route path="/admin-login" element={<SignIn />} />
          <Route index path="/reset-password" element={<ForgetPassword />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
        </Routes>
      </Router>
    </>
  );
}
