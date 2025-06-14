import {
  TuiAlertService,
  TuiButton, TuiHint,
  TuiRoot,
  TuiTextfield, TuiTitle
} from "@taiga-ui/core";
import { Component, computed, inject, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { Episode, EpisodeInfo, EpisodeResponse } from "../models/episode";
import { HttpClient } from "@angular/common/http";
import { TuiButtonLoading } from "@taiga-ui/kit";
import { interpolateRdYlGn } from "d3-scale-chromatic";
import chroma from "chroma-js";
import { TableCellComponent } from "./table-cell/table-cell.component";

@Component({
  selector: "app-root",
  imports: [
    FormsModule,
    TuiRoot,
    TuiTextfield,
    TuiButton,
    TuiButtonLoading,
    TuiHint,
    TableCellComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.less",
})
export class AppComponent {
  private readonly http = inject(HttpClient);
  private readonly alerts = inject(TuiAlertService);

  public readonly loading = signal(false);
  public readonly id = signal("");
  public readonly episodes = signal<Episode[][]>([]);
  public readonly info = signal<EpisodeInfo | null>(null);

  public readonly maxEpisodeSeason = computed(() => {
    let res = 0;

    for (const row of this.episodes()) {
      res = Math.max(res, row.length);
    }

    return Array.from({ length: res });
  });

  public background(value?: string): string {
    if (!value) {
      return "#FFFFFF";
    }

    try {
      const num = Number(value);

      return interpolateRdYlGn(num / 10);
    } catch {
      return "#FFFFFF";
    }
  }

  public color(background: string): string {
    const isLight = chroma(background).luminance() > 0.5;

    return isLight ? "#000000" : "#FFFFFF";
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
          .open("Error", {
            appearance: "negative",
          })
          .subscribe();
      },
    });
  }
}
