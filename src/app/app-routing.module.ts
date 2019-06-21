import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePage } from 'src/home/home.page';

const routes: Routes = [
  // {
  //   // If no path is supply then it will use this path. Let's set the
  //   // login page as this so that homepage does not load while the user
  //   // is loggedout or app restarts.
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
  {
    // path: 'home',
    // loadChildren: '../home/home.module#HomePageModule'
    path: 'home',
    component: HomePage
  },
  {
    path: 'list',
    loadChildren: '../list/list.module#ListPageModule'
  },
  { path: 'login',
    loadChildren: '../login/login.module#LoginPageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes
      // {
      //   preloadingStrategy: PreloadAllModules
      // }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
