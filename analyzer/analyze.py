from datetime import datetime
from .output import print_total_durations, print_total_durations_per_day, plot_total_durations_per_day, print_average, prettyprint
import sys

empty_category_placeholder = "Sonstiges"

get_activities = lambda row: row[0:3]
get_all_categories = lambda row: row[4]
get_all_activities = lambda row: row[5]
get_category_activity_map = lambda row: row[5:7]

get_date = lambda row: row[0]
get_activity = lambda row: row[1]
get_time = lambda row: datetime.strptime(row[2], "%H:%M")

def set_activity(row, new_value):
    row[1] = new_value

def remove_empty_rows(rows):
    # Remove empty rows
    def search_and_remove():
        for row in rows:
            if len(row) == 0 or all(not cell for cell in row) or not row:
                rows.remove(row)

                # Start from beginning
                return search_and_remove()

    search_and_remove()

def chunk_rows(rows):
    # Create chunks containing all rows for one day
    chunks = {}

    while len(rows):
        date = get_date(rows[0])
        chunk = []

        def next():
            row = rows[0]
            chunk.append(row)
            rows.remove(row)

        # Imitate a do-while loop
        next()
        while len(rows) and not get_date(rows[0]):
            next()

        chunks[date] = chunk
    
    return chunks


def create_durations(chunks):
    # Calculate the durations of all activities per day
    durations_per_day = {}

    for date, rows in chunks.items():
        durations = {}
        last_time = -1

        for row in rows:
            activity = get_activity(row)
            time = get_time(row)

            if last_time == -1:
                last_time = time
                continue

            if not activity in durations:
                durations[activity] = []

            duration = time - last_time
            durations[activity].append(duration)

            last_time = time
        
        durations_per_day[date] = durations

    return durations_per_day

def use_categories(activities, activity_category_map):
    # Replace activities with categories
    for row in activities:
        activity = get_activity(row)
        category = activity_category_map[activity] if activity in activity_category_map else empty_category_placeholder
        set_activity(row, category)

def validate_activities(activities, all_activities):
    # Check if all activities exists in all_activities
    for row in activities:
        activity = get_activity(row)

        # Exit with error
        if not activity in all_activities:
            sys.exit("Error: '{}' is an invalid activity".format(activity))

def format_data(rows):
    # Define sections
    activities, all_categories, all_activities, activity_category_map = [], [], [], []

    # Split spreadsheet into sections
    for row in rows:
        activities.append(get_activities(row))

        if(len(row) > 3):
            all_categories.append(get_all_categories(row))
            all_activities.append(get_all_activities(row))
            activity_category_map.append(get_category_activity_map(row))

    # Create a map for activity to category 
    new_map = {}
    for row in activity_category_map:
        if len(row) == 2:
            new_map[row[0]] = row[1]
    
    activity_category_map = new_map

    # Remove empty rows
    formatted_lists = (activities, all_categories, all_activities, activity_category_map)
    for formatted in formatted_lists:
        remove_empty_rows(formatted)

    return formatted_lists

def analyze(rows, summary=False, categories=False, plot=False, average=False):
    # Split spreadsheet into sections
    activities, all_categories, all_activities, activity_category_map = format_data(rows)

    # Check if all activities are valid
    validate_activities(activities, all_activities)

    # Replace activities with categories
    if categories:
        use_categories(activities, activity_category_map)

    # Create chunks containing all rows for one day
    chunks = chunk_rows(activities)

    # Calculate the durations of all activities per day
    durations = create_durations(chunks)

    # Output requested format
    if summary:
        print_total_durations(durations)

    elif plot:
        labels = all_categories if categories else all_activities
        plot_total_durations_per_day(durations, labels)

    elif average:
        print_average(durations)

    else:
        print_total_durations_per_day(durations)