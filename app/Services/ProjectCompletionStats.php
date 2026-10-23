<?php

namespace App\Services;

use App\Models\ProjectProgressUpdate;

class ProjectCompletionStats
{
    public function twoYearCompletionCounts(): array
    {
        $currentYear = now()->year;
        $currentPeriodStart = intdiv($currentYear, 2) * 2;
        $completionUpdates = ProjectProgressUpdate::query()
            ->where('status', 'Completed')
            ->whereDate('update_date', '<=', now()->toDateString())
            ->orderBy('update_date')
            ->get(['project_id', 'update_date']);

        $firstCompletionYear = $completionUpdates->first()?->update_date?->year;
        $firstPeriodStart = $firstCompletionYear === null
            ? $currentPeriodStart
            : intdiv($firstCompletionYear, 2) * 2;
        $projectsByPeriod = [];

        foreach ($completionUpdates as $update) {
            $periodStart = intdiv($update->update_date->year, 2) * 2;

            if ($periodStart > $currentPeriodStart) {
                continue;
            }

            $projectsByPeriod[$periodStart][$update->project_id] = true;
        }

        $periods = [];

        for (
            $periodStart = $firstPeriodStart;
            $periodStart <= $currentPeriodStart;
            $periodStart += 2
        ) {
            $periods[] = [
                'period' => "{$periodStart}-".($periodStart + 1),
                'completedProjects' => count($projectsByPeriod[$periodStart] ?? []),
            ];
        }

        return $periods;
    }
}
