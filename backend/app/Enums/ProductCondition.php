<?php

namespace App\Enums;

enum ProductCondition: string
{
    case New = 'new';
    case LikeNew = 'like_new';
    case VeryGood = 'very_good';
    case Good = 'good';
    case Fair = 'fair';
}
