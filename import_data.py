import os
import csv
from datetime import datetime

# Configure Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vehicle_tests.settings")
import django

django.setup()

# Import the Test model after configuring the settings
from test_app.models import Test

csv_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'csv_files', 'test_data.csv')

with open(csv_file_path) as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        Test.objects.create(
            TestName=row['TestName'],
            TestDateTime=datetime.strptime(row['TestDateTime'], '%d/%m/%Y %H:%M'),
            Cell=row['Cell'],
            VehicleID=row['VehicleID'],
            DriveTrace=row['DriveTrace'],
            Engineer=row['Engineer'],
            Driver=row['Driver'],
            IWR=float(row['IWR']),
            RMSSE=float(row['RMSSE']),
            TotalCOgkm=float(row['TotalCOgkm']),
            TotalCO2gkm=float(row['TotalCO2gkm'])
        )
