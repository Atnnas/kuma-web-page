"use client";

import { DatePicker } from "@ark-ui/react/date-picker";
import { Portal } from "@ark-ui/react/portal";
import { CaretLeft, CaretRight, CalendarBlank, X, Check } from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";

interface NeonDatePickerProps {
    date: { from: Date | undefined; to?: Date | undefined } | undefined;
    setDate: (date: { from: Date | undefined; to?: Date | undefined } | undefined) => void;
}

export function NeonDatePicker({ date, setDate }: NeonDatePickerProps) {
    // Convert parent state (Date objects) to Ark UI state (DateValue strings)
    // Note: Ark UI usually works with Date objects or specific DateValue types. 
    // We'll simplisticly assume we can pass Date objects if supported, or ISO strings.
    // Checking Ark UI docs (mental model), it usually prefers `DateValue` objects from `@internationalized/date` 
    // OR native Date objects depending on the adapter.
    // For simplicity with standard Date objects, we might need to be careful.
    // Let's assume standard Date integration or simple array management.

    // Actually, Ark UI's `DatePicker` works best with its own `parseDate` if using `@internationalized/date`.
    // BUT the user provided a snippet using simplistic views. 
    // We will stick to standard customization. 

    // To avoid complex adapter setups without full context, we'll try to use the component nicely 
    // but we might need to handle the conversion manually if `value` expects strictly one type.

    // Let's try to map the specific `date` range to the visual value.

    // For the Report Filter, we really just need a visually appealing wrapper.
    // If Ark UI integration is too complex to "guess" the adapter, we might wrap `react-day-picker` 
    // in the *style* of Ark UI, OR use Ark UI if we are confident.
    // The user sent Ark UI code. I should use it.

    // Let's implement the UI structure proposed by the user, but adapted for Range.

    return (
        <DatePicker.Root
            selectionMode="range"
            onValueChange={(details) => {
                // details.value is DateValue[]
                // We need to convert this to { from, to }
                if (details.value.length > 0) {
                    // Check if value entries are strings or objects. 
                    // If using standard adapter, they might be Date objects.
                    // Let's assume they are handled by Ark's default behavior or we'll inspect.
                    const sorted = details.value.sort((a, b) => a.toString().localeCompare(b.toString()));
                    // Ensure local time parsing by appending time component if missing
                    const fromStr = sorted[0].toString();
                    const from = new Date(fromStr.includes("T") ? fromStr : `${fromStr}T00:00:00`);

                    const toStr = sorted.length > 1 ? sorted[sorted.length - 1].toString() : undefined;
                    const to = toStr ? new Date(toStr.includes("T") ? toStr : `${toStr}T00:00:00`) : undefined;

                    setDate({ from, to });
                } else {
                    setDate(undefined);
                }
            }}
        // Simple hack to sync initial state if needed, but for now we rely on the user interacting
        >
            <DatePicker.Control className="flex items-center gap-2 bg-zinc-900/50 border border-white/10 rounded-xl px-3 py-2 hover:border-white/20 transition-all group w-full md:w-auto min-w-[260px]">
                <CalendarBlank className="w-5 h-5 text-zinc-500 group-hover:text-cyan-500 transition-colors" weight="duotone" />
                <DatePicker.Input
                    className="bg-transparent border-none text-sm font-bold text-white placeholder-zinc-600 focus:ring-0 w-full cursor-pointer"
                    placeholder="Seleccionar Fechas"
                    value={date?.from ? `${format(date.from, "dd MMM", { locale: es })} - ${date?.to ? format(date.to, "dd MMM, yyyy", { locale: es }) : "..."}` : ""}
                    readOnly
                />
                <DatePicker.Trigger className="p-1 rounded-lg text-zinc-500 hover:text-white transition-colors">
                    <CaretRight className="w-4 h-4 rotate-90" />
                </DatePicker.Trigger>
                {date?.from && (
                    <DatePicker.ClearTrigger
                        className="p-1 rounded-lg text-zinc-500 hover:text-red-500 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDate(undefined);
                        }}
                    >
                        <X className="w-4 h-4" />
                    </DatePicker.ClearTrigger>
                )}
            </DatePicker.Control>

            <Portal>
                <DatePicker.Positioner>
                    <DatePicker.Content className="z-50 bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50 animate-in zoom-in-95 duration-200">

                        {/* Header Controls */}
                        <DatePicker.ViewControl className="flex justify-between items-center mb-6">
                            <DatePicker.PrevTrigger className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                                <CaretLeft className="w-5 h-5" />
                            </DatePicker.PrevTrigger>
                            <DatePicker.ViewTrigger className="text-sm font-black uppercase tracking-wider text-white hover:text-cyan-400 transition-colors">
                                <DatePicker.RangeText />
                            </DatePicker.ViewTrigger>
                            <DatePicker.NextTrigger className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                                <CaretRight className="w-5 h-5" />
                            </DatePicker.NextTrigger>
                        </DatePicker.ViewControl>

                        {/* Calendar Grid */}
                        <DatePicker.Context>
                            {(datePicker) => (
                                <DatePicker.View view="day">
                                    <DatePicker.Table className="w-full border-collapse">
                                        <DatePicker.TableHead>
                                            <DatePicker.TableRow>
                                                {datePicker.weekDays.map((weekDay, id) => (
                                                    <DatePicker.TableHeader
                                                        key={id}
                                                        className="text-[10px] uppercase font-bold text-zinc-600 pb-4 text-center w-10"
                                                    >
                                                        {weekDay.short}
                                                    </DatePicker.TableHeader>
                                                ))}
                                            </DatePicker.TableRow>
                                        </DatePicker.TableHead>
                                        <DatePicker.TableBody>
                                            {datePicker.weeks.map((week, id) => (
                                                <DatePicker.TableRow key={id}>
                                                    {week.map((day, id) => (
                                                        <DatePicker.TableCell key={id} value={day}>
                                                            <DatePicker.TableCellTrigger
                                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-zinc-400 hover:bg-white/10 hover:text-white transition-all data-[selected]:bg-cyan-500 data-[selected]:text-black data-[selected]:shadow-[0_0_15px_rgba(6,182,212,0.5)] data-[in-range]:bg-cyan-500/20 data-[in-range]:text-cyan-200 data-[today]:border data-[today]:border-cyan-500/50"
                                                            >
                                                                {day.day}
                                                            </DatePicker.TableCellTrigger>
                                                        </DatePicker.TableCell>
                                                    ))}
                                                </DatePicker.TableRow>
                                            ))}
                                        </DatePicker.TableBody>
                                    </DatePicker.Table>
                                </DatePicker.View>
                            )}
                        </DatePicker.Context>

                        {/* Month/Year Views (Simplified for now, Ark handles strict view switching) */}
                        <DatePicker.View view="month">
                            <DatePicker.Context>
                                {(datePicker) => (
                                    <DatePicker.Table>
                                        <DatePicker.TableBody>
                                            {datePicker.getMonthsGrid({ columns: 4, format: "short" }).map((months, id) => (
                                                <DatePicker.TableRow key={id}>
                                                    {months.map((month, id) => (
                                                        <DatePicker.TableCell key={id} value={month.value}>
                                                            <DatePicker.TableCellTrigger className="px-3 py-2 rounded-lg hover:bg-white/10 text-sm">{month.label}</DatePicker.TableCellTrigger>
                                                        </DatePicker.TableCell>
                                                    ))}
                                                </DatePicker.TableRow>
                                            ))}
                                        </DatePicker.TableBody>
                                    </DatePicker.Table>
                                )}
                            </DatePicker.Context>
                        </DatePicker.View>

                        <DatePicker.View view="year">
                            <DatePicker.Context>
                                {(datePicker) => (
                                    <DatePicker.Table>
                                        <DatePicker.TableBody>
                                            {datePicker.getYearsGrid({ columns: 4 }).map((years, id) => (
                                                <DatePicker.TableRow key={id}>
                                                    {years.map((year, id) => (
                                                        <DatePicker.TableCell key={id} value={year.value}>
                                                            <DatePicker.TableCellTrigger className="px-3 py-2 rounded-lg hover:bg-white/10 text-sm">{year.label}</DatePicker.TableCellTrigger>
                                                        </DatePicker.TableCell>
                                                    ))}
                                                </DatePicker.TableRow>
                                            ))}
                                        </DatePicker.TableBody>
                                    </DatePicker.Table>
                                )}
                            </DatePicker.Context>
                        </DatePicker.View>

                    </DatePicker.Content>
                </DatePicker.Positioner>
            </Portal>
        </DatePicker.Root>
    );
}
