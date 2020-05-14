import pprint
from datetime import timedelta
from prettytable import PrettyTable
import matplotlib.pyplot as plt

colors = [[52, 152, 219], [155, 89, 182], [52, 73, 94], [241, 196, 15], [230, 126, 34], [231, 76, 60], [27, 20, 100], [111, 30, 81]]

for i in range(len(colors)):
    colors[i] = [c / 255 for c in colors[i]]

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

def plot_total_durations_per_day(durations_per_day, labels):
    label_color_map = dict((labels[i], colors[i]) for i in range(len(labels)))
    
    # Get summed durations per activity
    sum_durations_of_activities(durations_per_day)

    xs = []
    ys = []

    # Put days on the X-Axis, durations on the Y-Axis
    for date, durations in durations_per_day.items():
        xs.append(date)
        
        # Get the y values for current day
        singleDayYs = []
        for label in labels:
            # Get duration and format datetime object to integer
            duration = durations[label].seconds if label in durations else 0
            singleDayYs.append(duration)

        ys.append(singleDayYs)

    # Plot each labels graph with color
    for i in range(len(labels)):
        label = labels[i]
        color = label_color_map[label]
        
        # Get all durations for label
        labelYs = [singleDayYs[i] for singleDayYs in ys]

        # Plot durations with color
        plt.plot(xs, labelYs, c=color, label=label)

    # Style plot
    plt.xlabel("Datum")
    plt.ylabel("Dauer in h")
    plt.legend(loc="upper left")

    # Show plot
    plt.show()