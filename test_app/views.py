from django.http import JsonResponse
from django.shortcuts import render
from django.db.models import Q
from .models import Test

def index(request):
    return render(request, 'index.html')

def get_all_data(request):
    tests = Test.objects.all().values()
    return JsonResponse(list(tests), safe=False)

def get_vehicle_tests(request):
    vehicle_ids = request.GET.get('vehicle_ids', None)
    driver_names = request.GET.get('driver_names', None)
    drive_trace = request.GET.get('drive_traces', None)
    iwr = request.GET.get('iwr', None)
    totalCOgkm = request.GET.get('totalCOgkm', None)

    if vehicle_ids:
        vehicle_ids = vehicle_ids.split(',')
        if len(vehicle_ids) >= 1: 
            tests = Test.objects.filter(VehicleID__in=vehicle_ids).values()
            return JsonResponse(list(tests), safe=False)
        else:
            return JsonResponse([], safe=False)

    if driver_names:
        driver_names = driver_names.split(',')
        if len(driver_names) >= 1: 
            tests = Test.objects.filter(Cell__in=driver_names).values('Driver').distinct()
            return JsonResponse(list(tests), safe=False)
        else:
            return JsonResponse([], safe=False)

    if drive_trace:
        drive_traces = drive_trace.split(',')
        if len(drive_traces) >= 1: 
            tests = Test.objects.filter(DriveTrace__in=drive_traces).values()
            return JsonResponse(list(tests), safe=False)
        else:
            return JsonResponse([], safe=False)
    
    if iwr:
        iwr_value = iwr.split(',')
        if len(iwr_value) == 2:
            iwr_value_1, iwr_value_2 = iwr_value
            tests = Test.objects.filter(Q(IWR__gte=float(iwr_value_1)) & Q(IWR__lte=float(iwr_value_2))).values()
            return JsonResponse(list(tests), safe=False)
        
    if totalCOgkm:
        CO_value = totalCOgkm.split(',')
        if len(CO_value) == 2:
            CO_value_1, CO_value_2 = CO_value
            tests = Test.objects.filter(Q(TotalCOgkm__lt=float(CO_value_1)) & Q(TotalCO2gkm__gt=float(CO_value_2))).values()
            return JsonResponse(list(tests), safe=False)

    # If none of the conditions above are satisfied, return an empty list
    return JsonResponse([], safe=False)