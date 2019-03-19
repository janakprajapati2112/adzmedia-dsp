import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, HttpModule } from '@angular/http';
import { AuthRoutingModule } from './auth-routing.routing';
import { AuthComponent } from './auth.component';
import { AlertComponent } from './_directives/alert.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthGuard } from './_guards/auth.guard';
import { AlertService } from './_services/alert.service';
import { AuthenticationService } from './_services/authentication.service';
import { UserService } from './_services/user.service';

import {
    RECAPTCHA_SETTINGS,
    RecaptchaSettings,
    RecaptchaLoaderService,
    RecaptchaModule,
} from 'ng-recaptcha';

const globalSettings: RecaptchaSettings = { siteKey: '6Ld7s08UAAAAACKAx_9OnePqlrH2hwfPCX8SFCfy' };

@NgModule({
    declarations: [
        AuthComponent,
        AlertComponent,
        LogoutComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        AuthRoutingModule
    ],
    providers: [
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: globalSettings,
        },
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService

    ],
    entryComponents: [AlertComponent],
})

export class AuthModule {
}