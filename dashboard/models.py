from django.db import models

class InsightData(models.Model):
    end_year = models.CharField(max_length=10, null=True, blank=True)
    intensity = models.FloatField(null=True, blank=True)
    sector = models.TextField(null=True, blank=True)
    topic = models.CharField(max_length=200, null=True, blank=True)
    insight = models.TextField(null=True, blank=True)
    url = models.TextField(null=True, blank=True)
    region = models.CharField(max_length=100, null=True, blank=True)
    start_year = models.CharField(max_length=10, null=True, blank=True)
    impact = models.CharField(max_length=100, null=True, blank=True)
    added = models.CharField(max_length=100, null=True, blank=True)
    published = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    relevance = models.FloatField(null=True, blank=True)
    pestle = models.CharField(max_length=100, null=True, blank=True)
    source = models.TextField(null=True, blank=True)
    title = models.TextField(null=True, blank=True)
    likelihood = models.FloatField(null=True, blank=True)       
    city = models.CharField(max_length=100, null=True, blank=True)
    swot = models.CharField(max_length=255, blank=True, null=True)


    def __str__(self):
        return self.title if self.title else "Unnamed Insight"
