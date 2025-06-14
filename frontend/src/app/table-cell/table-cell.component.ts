import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Episode } from "../../models/episode";
import { TuiHint } from "@taiga-ui/core";

@Component({
  selector: "app-table-cell",
  templateUrl: "./table-cell.component.html",
  styleUrl: "./table-cell.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TuiHint],
})
export class TableCellComponent {
  public readonly episode = input.required<Episode>();
}
