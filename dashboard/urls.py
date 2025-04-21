from django.urls import path
from .views import *

urlpatterns = [
    path('api/insights/', InsightDataListAPIView.as_view(), name='insights-list'),
    path("api/chart-data/", chart_data, name="chart-data"),
    path("api/filters/", get_filter_options, name="filter-options"),
    path('', dashboard_view, name='dashboard'),
]
