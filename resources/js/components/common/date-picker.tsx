import { format } from 'date-fns';
import { enUS, id as localeId, type Locale } from 'date-fns/locale';
import { CalendarIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const locales: Record<string, Locale> = { en: enUS, id: localeId };

const parseIsoDate = (value?: string | null): Date | undefined => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
    if (!match) return undefined;

    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};

const formatIsoDate = (date: Date): string =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

interface DatePickerProps {
    id?: string;
    value?: string | null; // ISO Y-m-d, '' or null = empty
    onChange: (value: string) => void; // emits ISO Y-m-d or ''
    placeholder?: string;
    min?: string; // ISO Y-m-d lower bound
    max?: string; // ISO Y-m-d upper bound
    disabled?: boolean;
    className?: string;
}

export default function DatePicker({
    id,
    value,
    onChange,
    placeholder,
    min,
    max,
    disabled,
    className,
}: DatePickerProps) {
    const { t, i18n } = useTranslation();
    const locale = locales[(i18n.language || 'en').split('-')[0]] ?? enUS;
    const selected = parseIsoDate(value);

    const disabledMatchers = [];
    const minDate = parseIsoDate(min);
    const maxDate = parseIsoDate(max);
    if (minDate) disabledMatchers.push({ before: minDate });
    if (maxDate) disabledMatchers.push({ after: maxDate });

    const label = selected
        ? format(
              selected,
              (i18n.language || 'en').startsWith('id')
                  ? 'd MMM yyyy'
                  : 'MMM d, yyyy',
              { locale },
          )
        : (placeholder ?? t('common.pick_date'));

    return (
        <div className={cn('relative', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        id={id}
                        type="button"
                        disabled={disabled}
                        className={cn(
                            'flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs transition-[color,box-shadow] outline-none',
                            'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            selected ? 'pr-9' : 'pr-3',
                            !selected && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">{label}</span>
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selected}
                        defaultMonth={selected}
                        onSelect={(date) =>
                            onChange(date ? formatIsoDate(date) : '')
                        }
                        disabled={
                            disabledMatchers.length
                                ? disabledMatchers
                                : undefined
                        }
                        startMonth={new Date(1970, 0)}
                        endMonth={new Date(new Date().getFullYear() + 10, 11)}
                        captionLayout="dropdown"
                    />
                </PopoverContent>
            </Popover>
            {selected && !disabled && (
                <button
                    type="button"
                    tabIndex={-1}
                    aria-label={t('common.clear')}
                    onClick={() => onChange('')}
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground opacity-60 transition-opacity hover:opacity-100"
                >
                    <X className="size-3.5" />
                </button>
            )}
        </div>
    );
}
