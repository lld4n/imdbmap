import {HttpClient} from '@angular/common/http';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {TuiLoader, TuiTextfield, TuiTitle} from '@taiga-ui/core';
import {TuiAvatar} from '@taiga-ui/kit';
import {TuiCell} from '@taiga-ui/layout';
import {debounceTime, filter, switchMap, tap, timer} from 'rxjs';

import type {EpisodeInfo} from '../../models/episode';

const PREFIX_SEARCH = 'tt';

@Component({
    selector: 'app-search',
    imports: [TuiTextfield, FormsModule, TuiLoader, TuiAvatar, TuiCell, TuiTitle],
    templateUrl: './search.component.html',
    styleUrl: './search.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
    private readonly http = inject(HttpClient);

    public readonly id = input.required<string>();

    public readonly data = signal<EpisodeInfo[]>([]);
    public readonly loading = signal(false);

    public readonly idChange = output<string>();
    public readonly submit = output<void>();

    constructor() {
        toObservable(this.id)
            .pipe(
                tap(() => this.loading.set(true)),
                debounceTime(400),
                filter((q) => {
                    if (q.startsWith(PREFIX_SEARCH) || q.trim().length === 0) {
                        this.data.set([]);
                        this.loading.set(false);

                        return false;
                    }

                    return true;
                }),
                switchMap((q) => this.http.get<EpisodeInfo[]>(`/api/search?q=${q}`)),
            )
            .subscribe((data) => {
                this.data.set(data);
                this.loading.set(false);
            });
    }

    public openItem(item: EpisodeInfo): void {
        if (item.id) {
            this.idChange.emit(item.id);
            this.data.set([]);

            timer(200).subscribe(() => this.submit.emit());
        }
    }
}
