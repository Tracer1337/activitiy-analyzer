1. Remove empty rows

1. Chunk rows into days
    1. Set the current date to be the first column of first row
    1. Take all rows after that row (including itself), until the next date is encountered or no rows left
    1. Remove that chunk from the values
    1. Repeat until no rows left

1. Create durations_per_day list

1. For all chunks
    1. Create duration dictionary
        1. Take the first row
        1. Store its timestamp as the starting value
        1. Take the next row
        1. Calculate its duration by subtracting the previous timestamp from this one
        1. Add the duration to the dictionary with activity as key

    1. Add duration durations_per_day to durations list

1. Print durations_per_day list