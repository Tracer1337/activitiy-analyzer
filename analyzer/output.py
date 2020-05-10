import pprint
from datetime import timedelta
from prettytable import PrettyTable

def prettyprint(object):
    pp = pprint.PrettyPrinter(indent=4)
    pp.pprint(object)

def print_as_table(head, elements):
    table = PrettyTable(head)

    for key, value in elements.items():
        table.add_row([key, value])

    print(table)

def print_total_durations_per_day(durations_per_day):
    # Sum durations of each activity
    for date, rows in durations_per_day.items():        
        for activity, durations in rows.items():
            durations_sum = timedelta(0)
            
            for d in durations:
                durations_sum += d

            rows[activity] = str(durations_sum)[:-3]


    # Print tables
    for date, rows in durations_per_day.items():
        print(date)
        print_as_table(["Aktivität", "Dauer"], rows)
