<?php

namespace App\Enums;

enum UserRole: string
{
    case Visitor = 'visitor';
    case Seller = 'seller';
    case Moderator = 'moderator';
    case Admin = 'admin';
}
