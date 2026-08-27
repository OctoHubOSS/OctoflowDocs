'use client';

import { useState } from 'react';
import { BarChart3, Table2 } from 'lucide-react';
import type { AnalyticsResponse } from '@/lib/api';

const BAR_COLOR = '#3b82f6';

function formatDay(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function AnalyticsChart({ data }: { data: AnalyticsResponse }) {
  const [showTable, setShowTable] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const perDay = data.per_day;
  const byType = data.by_type.slice(0, 8);
  const maxDay = Math.max(1, ...perDay.map((d) => d.count));
  const maxType = Math.max(1, ...byType.map((t) => t.count));
  const totalEvents = perDay.reduce((sum, d) => sum + d.count, 0);

  if (perDay.length === 0 && byType.length === 0) {
    return (
      <div className="rounded-xl border border-fd-border bg-fd-card px-6 py-8 text-center text-sm text-fd-muted-foreground">
        No events recorded yet for this server.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-fd-border bg-fd-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-fd-border">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold flex items-center gap-1.5">
            <BarChart3 className="size-3.5" />
            Activity
          </h3>
          <span className="text-xs text-fd-muted-foreground tabular-nums">
            {totalEvents.toLocaleString()} events over the last {perDay.length} days
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors"
        >
          <Table2 className="size-3.5" />
          {showTable ? 'View chart' : 'View as table'}
        </button>
      </div>

      {showTable ? (
        <AnalyticsTable data={data} />
      ) : (
        <div className="px-6 py-5 flex flex-col gap-8">
          {/* Events per day */}
          {perDay.length > 0 && (
            <section className="flex flex-col gap-2">
              <span className="text-xs font-medium text-fd-muted-foreground">Events per day</span>
              <div className="flex items-end gap-[2px] h-28">
                {perDay.map((day, i) => {
                  const heightPct = Math.max(4, (day.count / maxDay) * 100);
                  const isMax = day.count === maxDay && maxDay > 0;
                  return (
                    <div
                      key={day.date}
                      className="group relative flex-1 h-full flex items-end"
                      onMouseEnter={() => setHoveredDay(i)}
                      onMouseLeave={() => setHoveredDay((cur) => (cur === i ? null : cur))}
                    >
                      <div
                        className="w-full rounded-t-[4px] transition-opacity"
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: BAR_COLOR,
                          opacity: hoveredDay === null || hoveredDay === i ? 1 : 0.55,
                        }}
                      />
                      {isMax && (
                        <span className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-medium text-fd-muted-foreground tabular-nums">
                          {day.count}
                        </span>
                      )}
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 rounded-md border border-fd-border bg-fd-popover px-2.5 py-1.5 text-xs text-fd-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                        {formatDay(day.date)}: {day.count.toLocaleString()} events
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-fd-muted-foreground">
                <span>{formatDay(perDay[0].date)}</span>
                <span>{formatDay(perDay[perDay.length - 1].date)}</span>
              </div>
            </section>
          )}

          {/* Top event types */}
          {byType.length > 0 && (
            <section className="flex flex-col gap-2">
              <span className="text-xs font-medium text-fd-muted-foreground">Top event types</span>
              <div className="flex flex-col gap-2">
                {byType.map((t) => (
                  <div key={t.event_type} className="flex items-center gap-3 group">
                    <span className="w-32 shrink-0 truncate text-xs font-mono text-fd-muted-foreground">
                      {t.event_type}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-fd-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(3, (t.count / maxType) * 100)}%`,
                          backgroundColor: BAR_COLOR,
                        }}
                      />
                    </div>
                    <span className="w-12 shrink-0 text-right text-xs tabular-nums text-fd-foreground">
                      {t.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function AnalyticsTable({ data }: { data: AnalyticsResponse }) {
  return (
    <div className="px-6 py-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-fd-muted-foreground">Events per day</span>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-fd-muted-foreground">
                <th className="font-medium pb-1">Date</th>
                <th className="font-medium pb-1 text-right">Count</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {data.per_day.map((d) => (
                <tr key={d.date} className="border-t border-fd-border">
                  <td className="py-1">{formatDay(d.date)}</td>
                  <td className="py-1 text-right">{d.count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-fd-muted-foreground">Event types</span>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-fd-muted-foreground">
                <th className="font-medium pb-1">Type</th>
                <th className="font-medium pb-1 text-right">Count</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {data.by_type.map((t) => (
                <tr key={t.event_type} className="border-t border-fd-border">
                  <td className="py-1 font-mono">{t.event_type}</td>
                  <td className="py-1 text-right">{t.count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
