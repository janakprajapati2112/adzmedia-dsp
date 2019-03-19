import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../auth/_guards/auth.guard";

const routes: Routes = [
    {
        "path": "",
        "component": ThemeComponent,
        "canActivate": [AuthGuard],
        "children": [
            {
                "path": "index",
                "loadChildren": "..\/dashboard\/dashboard.module#DashboardModule"
            },
            {
                "path": "advance-reporting",
                "loadChildren": ".\/pages\/aside-left-display-disabled\/reporting\/reporting.module#ReportingModule"
            },
            {
                "path": "creatives-app",
                "loadChildren": "..\/creatives\/creatives.module#CreativesModule"
            },
            {
                "path": "create-campaign",
                "loadChildren": "..\/campaigns\/campaigns.module#CampaignsModule"
            },
            {
                "path": "edit-campaign/:id",
                "loadChildren": "..\/editcampaign\/editcampaign.module#EditcampaignModule"
            },
            {
                "path": "campaigns",
                "loadChildren": ".\/pages\/default\/campaign_list\/campaign-list.module#CampaignListModule"
            },
            {
                "path": "inventory",
                "loadChildren": "..\/app-inventory\/app-inventory.module#AppInventoryModule"
            },

            {
                "path": "reports",
                "loadChildren": "..\/reports\/reports.module#ReportsModule"
            },
            {
                "path": "edit-inventory/:id",
                "loadChildren": "..\/app-inventory\/app-inventory.module#AppInventoryModule"
            },
            {
                "path": "app-list",
                "loadChildren": "..\/app-inventory\/inventory-list.module#InventorylistModule"
            },
            {
                "path": "campaign-list",
                "loadChildren": "..\/campaignlist\/campaignlist.module#CampaignlistModule"
            },
            {
                "path": "add-fund",
                "loadChildren": "..\/fundmanager\/fundmanager.module#FundmanagerModule"
            },

            {
                "path": "view-transactions",
                "loadChildren": "..\/fundmanager\/transactions.module#TransactionsModule"
            },
            {
                "path": "404",
                "loadChildren": ".\/pages\/default\/not-found\/not-found.module#NotFoundModule"
            },

            {
                "path": "invoice/:id",
                "loadChildren": "..\/fundmanager\/invoice.module#InvoiceModule"
            },
            {
                "path": "",
                "redirectTo": "index",
                "pathMatch": "full"
            }
        ]
    },
    {
        "path": "**",
        "redirectTo": "404",
        "pathMatch": "full"
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ThemeRoutingModule { }