from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import InsightData
from .serializers import InsightDataSerializer
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Avg


class InsightDataListAPIView(generics.ListAPIView):
    queryset = InsightData.objects.all()
    serializer_class = InsightDataSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [
        'end_year', 'topic', 'sector', 'region', 'pestle', 'source',
        'country', 'likelihood', 'intensity', 'relevance', 'city'
    ]


@api_view(['GET'])
def get_filter_options(request):
    data = {
        "country": list(InsightData.objects.values_list("country", flat=True).distinct().exclude(country__isnull=True).exclude(country="")),
        "region": list(InsightData.objects.values_list("region", flat=True).distinct().exclude(region__isnull=True).exclude(region="")),
        "topic": list(InsightData.objects.values_list("topic", flat=True).distinct().exclude(topic__isnull=True).exclude(topic="")),
        "sector": list(InsightData.objects.values_list("sector", flat=True).distinct().exclude(sector__isnull=True).exclude(sector="")),
        "pestle": list(InsightData.objects.values_list("pestle", flat=True).distinct().exclude(pestle__isnull=True).exclude(pestle="")),
        "source": list(InsightData.objects.values_list("source", flat=True).distinct().exclude(source__isnull=True).exclude(source="")),
        "swot": list(InsightData.objects.values_list("swot", flat=True).distinct().exclude(swot__isnull=True).exclude(swot="")),
        "city": list(InsightData.objects.values_list("city", flat=True).distinct().exclude(city__isnull=True).exclude(city="")),
        "end_year": list(InsightData.objects.values_list("end_year", flat=True).distinct().exclude(end_year__isnull=True).exclude(end_year="")),
    }
    return Response(data)


@api_view(['GET'])
def chart_data(request):
    var = request.GET.get('var')
    data = {"labels": [], "values": []}

    if not var:
        return Response({"error": "Missing 'var' parameter"}, status=400)

    valid_vars = [
        "intensity", "likelihood", "relevance", "country", "region", "city",
        "topic", "sector", "pestle", "source", "swot", "year", "end_year", "trend"
    ]

    if var not in valid_vars:
        return Response({"error": f"Invalid 'var' parameter: {var}"}, status=400)

    if var == "intensity":
        grouped = InsightData.objects.values('country').annotate(avg_intensity=Avg('intensity'))
        data["labels"] = [entry['country'] for entry in grouped if entry['country']]
        data["values"] = [entry['avg_intensity'] for entry in grouped if entry['country']]

    elif var == "likelihood":
        grouped = InsightData.objects.values('country').annotate(avg_likelihood=Avg('likelihood'))
        data["labels"] = [entry['country'] for entry in grouped if entry['country']]
        data["values"] = [entry['avg_likelihood'] for entry in grouped if entry['country']]

    elif var == "relevance":
        grouped = InsightData.objects.values('country').annotate(avg_relevance=Avg('relevance'))
        data["labels"] = [entry['country'] for entry in grouped if entry['country']]
        data["values"] = [entry['avg_relevance'] for entry in grouped if entry['country']]

    elif var in ['country', 'region', 'city', 'topic', 'sector', 'pestle', 'source', 'swot', 'year', 'end_year']:
        grouped = InsightData.objects.values(var).annotate(count=Count(var)).order_by('-count')
        data["labels"] = [entry[var] for entry in grouped if entry[var]]
        data["values"] = [entry['count'] for entry in grouped if entry[var]]

    elif var == "trend":
        grouped = InsightData.objects.values('end_year').annotate(avg_intensity=Avg('intensity')).order_by('end_year')
        data["labels"] = [entry['end_year'] for entry in grouped if entry['end_year']]
        data["values"] = [entry['avg_intensity'] for entry in grouped if entry['end_year']]

    return Response(data)

def dashboard_view(request):
    return render(request, 'dashboard.html')

