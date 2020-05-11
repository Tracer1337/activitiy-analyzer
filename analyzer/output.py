import pprint
from datetime import timedelta
from prettytable import PrettyTable

def sort_by_time(unsorted):
    result = []

    for i in range(len(unsorted)):
        # Get max value
        max_value = ["", timedelta(-1)]

        for key, value in unsorted.items():
            if value > max_value[1]:
                max_value = [key, value]

        # Remove max value
        del unsorted[max_value[0]]

        # Remove seconds from value
        max_value[1] = str(max_value[1])[:-3]

        # Add max value to sorted list
        result.append(max_value)

    return result

def prettyprint(object):
    pp = pprint.PrettyPrinter(indent=4)
    pp.pprint(object)

def print_table(head, rows):
    table = PrettyTable(head)

    for row in rows:
        table.add_row(row)

    print(table)

def sum_durations_of_activities(durations_per_day):
    # Sum durations of each activity
    for date, rows in durations_per_day.items():        
        for activity, durations in rows.items():
            durations_sum = timedelta(0)
            
            for d in durations:
                durations_sum += d

            rows[activity] = durations_sum

def sum_durations_of_days(durations_per_day):
    # Sum durations of each activity for all days
    summed_durations = {}
    for date, rows in durations_per_day.items():
        for activity, duration in rows.items():

            if not activity in summed_durations:
                summed_durations[activity] = duration
            else:
                summed_durations[activity] += duration

    return summed_durations

def print_total_durations(durations_per_day):
    sum_durations_of_activities(durations_per_day)
    summarized_durations = sum_durations_of_days(durations_per_day)
    rows = sort_by_time(summarized_durations)

    print_table(["Aktivität", "Dauer"], rows)

def print_total_durations_per_day(durations_per_day):
    sum_durations_of_activities(durations_per_day)
        
    # Print tables
    for date, rows in durations_per_day.items():
        # Sort rows and convert them to arrays
        rows = sort_by_time(rows)

        print("\n" + date + "\n")

        print_table(["Aktivität", "Dauer"], rows)
