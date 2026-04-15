<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>

        <title>@yield('title') - Laravel User Monitoring</title>

        @yield('style')
        <style>
            .checkbox:checked + .check-icon {
                display: flex;
            }

            /* Dark Mode */
            body.dark-mode {
                background-color: #222831;
            }

            body.dark-mode .title-bar {
                color: #fff;
            }

            body.dark-mode .tab-box {
                background-color: #222831;
            }

            body.dark-mode .tab-title {
                color: #fff;
            }

            body.dark-mode .tab-title:hover {
                color: #4338ca;
            }

            body.dark-mode :is(a, p, path) {
                color: #fff;
            }

            body.dark-mode .delete-btn {
                background-color: rgb(234, 56, 56);
            }

            body.dark-mode .bg-indigo-100 p {
                color: #000;
            }
        </style>
    </head>
    <body @class(['dark-mode' => config('user-monitoring.config.dark_mode', false)])>
        <div class="sm:px-6 w-full">
            <div class="px-4 md:px-10 py-4 md:py-7">
                <div class="flex items-center justify-between">
                    <p class="focus:outline-none text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800 title-bar" tabindex="0">
                        LMS FA3 User Monitoring 
                    </p>
                    
                    <a href="/dashboard" class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Ke Dashboard
                    </a>
                </div>
            </div>
            <div class="bg-white py-4 md:py-7 px-4 md:px-8 xl:px-10 tab-box">
                @if (session()->has('message'))
                    <div class="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3 mb-4 rounded" role="alert">
                        <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/>
                        </svg>
                        <p>{{ session()->get('message') }}</p>
                    </div>
                @endif

                @yield('content')
            </div>
        </div>
    </body>
</html>