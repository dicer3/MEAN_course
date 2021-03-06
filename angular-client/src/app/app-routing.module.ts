import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router"
import { AuthGaurd } from "./auth/auth.guard";
import { LoginComponent } from "./auth/login/login.component";
import { SignUpComponent } from "./auth/signup/signup.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostListComponent } from "./posts/post-list/post-list.component";

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGaurd] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGaurd] },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignUpComponent }
  // { path: "auth", loadChildren: 'src/app/auth/auth.module#AuthModule' }
  // { path: "auth", loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGaurd]
})

export class AppRoutingModule { }
