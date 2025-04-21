import json
from django.core.management.base import BaseCommand
from dashboard.models import InsightData

class Command(BaseCommand):
    help = 'Import data from JSON file into PostgreSQL'

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str, help='Path to the JSON file')

    def handle(self, *args, **kwargs):
        file_path = kwargs['file_path']
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)

                def to_int(value):
                    try:
                        return int(value)
                    except (ValueError, TypeError):
                        return None

                for item in data:
                    InsightData.objects.create(
                        end_year=item.get('end_year'),
                        intensity=to_int(item.get('intensity')),
                        sector=item.get('sector'),
                        topic=item.get('topic'),
                        insight=item.get('insight'),
                        url=item.get('url'),
                        region=item.get('region'),
                        start_year=item.get('start_year'),
                        impact=item.get('impact'),
                        added=item.get('added'),
                        published=item.get('published'),
                        country=item.get('country'),
                        relevance=to_int(item.get('relevance')),
                        pestle=item.get('pestle'),
                        source=item.get('source'),
                        title=item.get('title'),
                        likelihood=to_int(item.get('likelihood')),
                    )

                self.stdout.write(self.style.SUCCESS('Data imported successfully!'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
