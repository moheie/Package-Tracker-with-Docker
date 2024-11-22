import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthService } from './services/auth.service';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { HomePageComponent } from './home-page/home-page.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { HomeAdminnComponent } from './home-adminn/home-adminn.component';
import { OrdersAdminComponent } from './orders-admin/orders-admin.component';
import { AdminAssignComponent } from './admin-assign/admin-assign.component';
import { AdminUpdateComponent } from './admin-update/admin-update.component';
import { CourierUpdateComponent } from './courier-update/courier-update.component';
import { CourierViewComponent } from './courier-view/courier-view.component';
import { CourierHomeComponent } from './courier-home/courier-home.component';
import { OrderFilterCourierComponent } from './order-filter-courier/order-filter-courier.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    SplashScreenComponent,
    HomePageComponent,
    OrderPageComponent,
    MyOrdersComponent,
    OrderDetailsComponent,
    HomeAdminnComponent,
    OrdersAdminComponent,
    AdminAssignComponent,
    AdminUpdateComponent,
    CourierUpdateComponent,
    CourierViewComponent,
    CourierHomeComponent,
    OrderFilterCourierComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
