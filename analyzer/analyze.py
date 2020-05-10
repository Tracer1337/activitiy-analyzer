from datetime import datetime
from .output import print_total_durations_per_day, prettyprint

getDate = lambda column: column[0]
getActivity = lambda column: column[1]
getTime = lambda column: datetime.strptime(column[2], "%H:%M")

def remove_empty_rows(rows):
    for row in rows:
        if len(row) == 0:
            rows.remove(row)

    return rows

def chunk_rows(rows):
    chunks = {}

    while len(rows):
        date = getDate(rows[0])
        chunk = []

        def next():
            row = rows[0]
            chunk.append(row)
            rows.remove(row)

        # Imitate a do-while loop
        next()
        while len(rows) and not getDate(rows[0]):
            next()

        chunks[date] = chunk
    
    return chunks


def create_durations(chunks):
    durations_per_day = {}

    for date, rows in chunks.items():
        durations = {}
        last_time = -1

        for row in rows:
            activity = getActivity(row)
            time = getTime(row)

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

def analyze(rows):
    # Remove empty rows
    rows = remove_empty_rows(rows)

    # Create chunks containing all rows for one day
    chunks = chunk_rows(rows)

    # Calculate the durations of all activities per day
    durations = create_durations(chunks)

    print_total_durations_per_day(durations)