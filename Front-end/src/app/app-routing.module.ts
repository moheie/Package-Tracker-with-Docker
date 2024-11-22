import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SplashScreenComponent} from './splash-screen/splash-screen.component';
import {LoginComponent} from './login/login.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {HomePageComponent} from './home-page/home-page.component';
import {OrderPageComponent} from './order-page/order-page.component';
import {MyOrdersComponent} from './my-orders/my-orders.component';
import {OrderDetailsComponent} from './order-details/order-details.component';
import {HomeAdminnComponent} from './home-adminn/home-adminn.component';
import {OrdersAdminComponent} from './orders-admin/orders-admin.component';
import { OrderFilterCourierComponent } from './order-filter-courier/order-filter-courier.component';
import {AdminAssignComponent} from './admin-assign/admin-assign.component';
import {AdminUpdateComponent} from './admin-update/admin-update.component';
import {CourierHomeComponent} from "./courier-home/courier-home.component";
import {CourierViewComponent} from "./courier-view/courier-view.component";
import {CourierUpdateComponent} from "./courier-update/courier-update.component";


const routes: Routes = [
  {path: '', component: SplashScreenComponent},
  {path: 'login', component: LoginComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'home', component: HomePageComponent},
  {path: 'order-page', component: OrderPageComponent},
  {path: 'my-orders', component: MyOrdersComponent},
  {path: 'order-details/:orderId', component: OrderDetailsComponent},
  {path: 'home-admin', component: HomeAdminnComponent},
  {path: 'orders-admin', component: OrdersAdminComponent},
  {path: 'order-filter-courier', component: OrderFilterCourierComponent},
  {path: 'admin-assign/:orderId', component: AdminAssignComponent},
  {path: 'admin-update/:orderId', component: AdminUpdateComponent},
  {path: 'home-courier', component: CourierHomeComponent},
  {path: 'assigned-orders', component: CourierViewComponent},
  {path:'order/:orderId/status',component:CourierUpdateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
