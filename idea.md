WebApp:

* Mobile first

* Accounts
    * Store activities

    * Integrate Google login

* Add activities easily
    * Provide presetted activities and categories
    * Define Shortcuts and bind icons to them
        * Presetted shortcuts: Wake up (Sun Icon) / Go to bed (Moon Icon)

* Analyzing those activities in the users dashboard
    * Switch between analyzing activities or categories
    * Charts and tables
        * Bar chart with bars for every day

* List all activities
    * Sort by total duration 

    * Show Statistics
        * Total duration
        * Average duration per day
    
    * Click on activity:
        * Activity Analysis Screen
            * Graph
                * X-Axis: Day
                * Y-Axis: Duration

* Tag categories as
    * good / bad

* Tag activities as
    * active / passive

* Show day-intervals where no activity recordings where made

* Buttons: Get Up / Go To Bed

* "Happy with the day" Button

* Integrate GitHub Hooks into deployment process

* Skeleton-loading instead of circular loading

* Cake-Chart for category durations
* Same Page / Charts for category like activities

Routes:

* api
    * auth (protected)
        * GET: Get profile

        * register
            * POST: Create new user

        * login
            * POST: Log into existing user

    * activities (protected)
        * GET: Get all activities from user
        * POST: Create new activity for user
            - Assign category
            - Assign tags
        * PUT: Update existing activity from user
        * DELETE: Delete existing activity from user

    * categories (protected)
        * GET: Get all categories from user
        * POST: Create new category for user
            - Assign tags
        * PUT: Update existing category from user
        * DELETE: Delete existing category from user

    * performed_activities (protected)
        * GET: Get all performed activities from user
        * POST: Add performed activity to database for user
        * PUT: Update existing entry from user
        * DELETE: Delete existing entry from user

    * shortcuts (protected)
        * GET: Get all shortcuts from user
        * POST: Create new shortcut for user
        * PUT: Update existing shortcut from user
        * DELETE: Delete existing shortcut from user

    * tags (protected)
        * GET: Get all tags from user
        * POST: Create new tag for user
        * PUT: Update existing tag from user
        * DELETE: Delete existing tag from user