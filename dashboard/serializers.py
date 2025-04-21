from rest_framework import serializers
from .models import InsightData

class InsightDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsightData
        fields = '__all__'
