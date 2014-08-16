#!/usr/bin/env python

import csv
import datetime
import json
import sys

center = [ 43.659585, -79.390308 ] # Queen's Park

import math
 
def distance(origin, destination):
    lat1, lon1 = origin
    lat2, lon2 = destination
    radius = 6371 # km

    dlat = math.radians(lat2-lat1)
    dlon = math.radians(lon2-lon1)
    a = math.sin(dlat/2) * math.sin(dlat/2) + math.cos(math.radians(lat1)) \
        * math.cos(math.radians(lat2)) * math.sin(dlon/2) * math.sin(dlon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    d = radius * c

    return d

accidents = []
reader = csv.DictReader(open(sys.argv[1]))
for row in reader:
    # make data make more sense
    try:
        if float(row['latitude']) and float(row['longitude']):
            # filter out really old accident reports (> 10 years old?)
            if datetime.datetime.strptime(row['Date/Time'], "%Y/%m/%d").year > 2005:
                if distance([float(row['latitude']), float(row['longitude'])], center) < 10:
                    accidents.append(row)
                    #print row
           #print row['Cyclist Crash Type / Cause']
    except ValueError:
        #print "WARNING: bad row %s" % row
        pass

print json.dumps(accidents)
