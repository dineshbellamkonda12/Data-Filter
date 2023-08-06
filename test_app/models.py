from django.db import models

class Test(models.Model):
    TestName = models.CharField(max_length=50)
    TestDateTime = models.DateTimeField()
    Cell = models.CharField(max_length=50)
    VehicleID = models.CharField(max_length=50)
    DriveTrace = models.CharField(max_length=50)
    Engineer = models.CharField(max_length=50)
    Driver = models.CharField(max_length=50)
    IWR = models.FloatField()
    RMSSE = models.FloatField()
    TotalCOgkm = models.FloatField()
    TotalCO2gkm = models.FloatField()
