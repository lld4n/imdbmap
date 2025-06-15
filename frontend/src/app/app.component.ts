import {HttpClient} from '@angular/common/http';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal,
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
    TuiAlertService,
    TuiButton,
    TuiHint,
    TuiPopup,
    TuiRoot,
    TuiTextfield,
    TuiTitle,
} from '@taiga-ui/core';
import {TuiAvatar, TuiButtonLoading, TuiDrawer} from '@taiga-ui/kit';
import {TuiCell, TuiHeader} from '@taiga-ui/layout';
import chroma from 'chroma-js';
import {interpolateRdYlGn} from 'd3-scale-chromatic';

import type {Episode, EpisodeInfo, EpisodeResponse} from '../models/episode';
import {TableCellComponent} from './table-cell/table-cell.component';

@Component({
    selector: 'app-root',
    imports: [
        FormsModule,
        TuiRoot,
        TuiTextfield,
        TuiButton,
        TuiButtonLoading,
        TuiHint,
        TableCellComponent,
        TuiDrawer,
        TuiPopup,
        TuiHeader,
        TuiTitle,
        TuiCell,
        TuiAvatar,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    private readonly http = inject(HttpClient);
    private readonly alerts = inject(TuiAlertService);

    public readonly loading = signal(false);
    public readonly id = signal('');
    public readonly cacheDrawer = signal(false);
    public readonly episodes = signal<Episode[][]>([]);
    public readonly info = signal<EpisodeInfo | null>(null);
    public readonly cache = signal<EpisodeResponse[]>([]);

    public readonly maxEpisodeSeason = computed(() => {
        let res = 0;

        for (const row of this.episodes()) {
            res = Math.max(res, row.length);
        }

        return Array.from({length: res});
    });

    public background(value?: string): string {
        if (!value) {
            return '#FFFFFF';
        }

        try {
            const num = Number(value);

            return interpolateRdYlGn(num / 10);
        } catch {
            return '#FFFFFF';
        }
    }

    public color(background: string): string {
        const isLight = chroma(background).luminance() > 0.5;

        return isLight ? '#000000' : '#FFFFFF';
    }

    public submit(): void {
        this.loading.set(true);
        this.http.get<EpisodeResponse>(`/api/episodes?id=${this.id()}`).subscribe({
            next: (data) => {
                this.loading.set(false);
                this.episodes.set(data.episodes);
                this.info.set(data.info);
            },
            error: () => {
                this.loading.set(false);
                this.alerts
                    .open('Error', {
                        appearance: 'negative',
                    })
                    // eslint-disable-next-line rxjs/no-nested-subscribe
                    .subscribe();
            },
        });
    }

    public openCache(): void {
        this.cacheDrawer.set(true);

        if (this.cache().length) {
            return;
        }

        this.http
            .get<EpisodeResponse[]>('/api/cache')
            .subscribe((data) => this.cache.set(data));
    }

    public openCachedItem(item: EpisodeResponse): void {
        this.cacheDrawer.set(false);

        this.episodes.set(item.episodes);
        this.info.set(item.info);
    }
}
