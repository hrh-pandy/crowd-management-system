import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrowdEntriesComponent } from './crowd-entries.component';

const routes: Routes = [
  {
    path: '',
    component: CrowdEntriesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrowdEntriesRoutingModule {}
