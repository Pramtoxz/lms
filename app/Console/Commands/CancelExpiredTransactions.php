<?php

namespace App\Console\Commands;

use App\Models\Transaction;
use Illuminate\Console\Command;

class CancelExpiredTransactions extends Command
{
    protected $signature = 'transactions:cancel-expired';

    protected $description = 'Cancel pending transactions that are older than 30 minutes';

    public function handle(): int
    {
        $expiredTransactions = Transaction::where('status', 'pending')
            ->where('created_at', '<', now()->subMinutes(30))
            ->get();

        $count = $expiredTransactions->count();

        if ($count === 0) {
            $this->info('No expired transactions found.');

            return self::SUCCESS;
        }

        foreach ($expiredTransactions as $transaction) {
            $transaction->update(['status' => 'expired']);
        }

        $this->info("Successfully cancelled {$count} expired transaction(s).");

        return self::SUCCESS;
    }
}
