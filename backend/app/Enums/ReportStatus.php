<?php

namespace App\Enums;

enum ReportStatus: string
{
    case Pending = 'pending';
    case Reviewed = 'reviewed';
    case Dismissed = 'dismissed';
    case ActionTaken = 'action_taken';
}
