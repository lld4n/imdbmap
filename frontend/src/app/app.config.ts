import {provideHttpClient} from '@angular/common/http';
import type {ApplicationConfig} from '@angular/core';
import {provideZoneChangeDetection} from '@angular/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideEventPlugins} from '@taiga-ui/event-plugins';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideZoneChangeDetection({eventCoalescing: true}),
        provideHttpClient(),
        provideEventPlugins(),
    ],
};
