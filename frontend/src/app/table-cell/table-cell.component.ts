import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TuiHint} from '@taiga-ui/core';

import type {Episode} from '../../models/episode';
import {TuiChip} from '@taiga-ui/kit';

@Component({
    selector: 'app-table-cell',
    imports: [TuiHint, TuiChip],
    templateUrl: './table-cell.component.html',
    styleUrl: './table-cell.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCellComponent {
    public readonly episode = input.required<Episode>();
}
