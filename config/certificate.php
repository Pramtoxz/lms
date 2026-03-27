<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Certificate Text Coordinates (Fixed)
    |--------------------------------------------------------------------------
    |
    | Koordinat text yang fixed untuk overlay di certificate template.
    | Admin harus design template sesuai koordinat ini.
    | Format: [x, y, font_size, color, align]
    |
    */

    'coordinates' => [
        'name' => [
            'x' => 1485,        // Center horizontal (A4 landscape 2970px width / 2)
            'y' => 1200,        // Position dari atas
            'font_size' => 80,
            'color' => '#333333',
            'align' => 'center',
        ],
        'course' => [
            'x' => 1485,
            'y' => 1450,
            'font_size' => 60,
            'color' => '#764ba2',
            'align' => 'center',
        ],
        'date' => [
            'x' => 300,
            'y' => 1900,
            'font_size' => 35,
            'color' => '#666666',
            'align' => 'left',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Certificate Template Size
    |--------------------------------------------------------------------------
    |
    | Ukuran template yang harus diupload admin.
    | A4 Landscape: 297mm x 210mm = 2970px x 2100px (300 DPI)
    |
    */

    'template_size' => [
        'width' => 2970,
        'height' => 2100,
        'dpi' => 300,
    ],

    /*
    |--------------------------------------------------------------------------
    | Available Fonts
    |--------------------------------------------------------------------------
    |
    | Daftar font yang tersedia untuk sertifikat.
    | Admin bisa memilih font per course.
    |
    */

    'available_fonts' => [
        'dejavu' => [
            'name' => 'DejaVu Sans',
            'path' => public_path('fonts/dejavu-fonts-ttf-2.37/ttf/DejaVuSans.ttf'),
        ],
        'poppins' => [
            'name' => 'Poppins',
            'path' => public_path('fonts/Poppins/Poppins-Regular.ttf'),
        ],
        'lobster' => [
            'name' => 'Lobster',
            'path' => public_path('fonts/Lobster/Lobster-Regular.ttf'),
        ],
        'alfa' => [
            'name' => 'Alfa Slab One',
            'path' => public_path('fonts/Alfa_Slab_One/AlfaSlabOne-Regular.ttf'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Font
    |--------------------------------------------------------------------------
    |
    | Font default jika course tidak memilih font khusus
    |
    */

    'default_font' => 'dejavu',

    /*
    |--------------------------------------------------------------------------
    | Font Path (Legacy - untuk backward compatibility)
    |--------------------------------------------------------------------------
    |
    | Path ke font file untuk text overlay.
    | Font DejaVuSans.ttf sudah tersedia di public/fonts/
    |
    */

    'font_path' => public_path('fonts/dejavu-fonts-ttf-2.37/ttf/DejaVuSans.ttf'),
];
