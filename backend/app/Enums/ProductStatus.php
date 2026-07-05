<?php

namespace App\Enums;

enum ProductStatus: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Sold = 'sold';
    case Archived = 'archived';
    case Flagged = 'flagged';
}
