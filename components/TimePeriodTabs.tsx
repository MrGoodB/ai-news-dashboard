'use client';

type TimePeriod = 'all' | 'today' | 'week';

interface TimePeriodTabsProps {
  selected: TimePeriod;
  onChange: (period: TimePeriod) => void;
  counts: {
    all: number;
    today: number;
    week: number;
  };
}

export function TimePeriodTabs({ selected, onChange, counts }: TimePeriodTabsProps) {
  const tabs: { id: TimePeriod; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'today', label: 'Today', count: counts.today },
    { id: 'week', label: 'This Week', count: counts.week },
  ];

  return (
    <div className="mb-6 flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${selected === tab.id
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }
          `}
        >
          {tab.label}
          <span className={`ml-1.5 text-xs ${selected === tab.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}

export type { TimePeriod };
