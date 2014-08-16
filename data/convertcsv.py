#!/usr/bin/env python

import csv
import json
import sys

accidents = []
reader = csv.DictReader(open(sys.argv[1]))
for row in reader:
    # make data make more sense
    try:
        if float(row['latitude']) and float(row['longitude']):
            #print row['Cyclist Crash Type / Cause']
            accidents.append(row)
    except ValueError:
        #print "WARNING: bad row %s" % row
        pass

print json.dumps(accidents)
