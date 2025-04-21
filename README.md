# 📊 Insights Dashboard – BlackCoffer VizDash

![Dashboard Preview](https://via.placeholder.com/800x400) <!-- Replace with an actual screenshot URL -->

A dynamic, interactive dashboard built with **Django**, **Chart.js**, and **Bootstrap 5**, designed to visualize and explore global insights across multiple dimensions such as intensity, relevance, likelihood, region, topic, and more.

Ideal for businesses, analysts, and researchers who need data-driven decision-making tools.

---

## 📖 About the Project

**Insights Dashboard (VizDash)** offers a clean interface to analyze large-scale global insight datasets. Through its filterable UI and interactive visualizations, users can discover trends and explore relationships across regions, sectors, and other key variables.

This project is inspired by **BlackCoffer's** data challenge and adapted for rich visualization and UX.

---

## 🚀 Features

✅ Dynamic charts (bar, pie, line)  
✅ Multiple filter dropdowns (End Year, Region, Topic, etc.)  
✅ Real-time data rendering via Django views & REST API  
✅ Average metrics (Intensity, Likelihood, Relevance)  
✅ Export & Refresh data (UI placeholders for future features)  
✅ Clean and responsive layout (Vuexy-style inspired)

---

## 🛠️ Tech Stack

**Backend:** Django, Django REST Framework  
**Frontend:** HTML, CSS (Bootstrap 5), JavaScript (Chart.js)  
**Database:** PostgreSQL (Production) / SQLite (Dev)  
**APIs:** RESTful JSON API with dynamic filtering

---

## 📁 Project Structure

vizdash/ 
│ ├── dashboard/ # Core dashboard app 
│ ├── models.py # Data models for insights 
│ ├── views.py # API + chart logic 
│ ├── serializers.py # DRF serializers 
│ ├── templates/ # HTML (Bootstrap 5) 
│ ├── static/ # JS, Chart configs 
│ └── urls.py # App-specific routing 
│ ├── staticfiles/ # Collected static assets 
├── manage.py # Django manager script 
├── requirements.txt # Python dependencies 
├── .gitignore # Ignored files 
└── README.md 


---

## ⚙️ Setup Instructions

### ✅ Prerequisites

- Python 3.8+
- Django 4.0+
- PostgreSQL (recommended)
- [Optional] Node.js (for frontend pipeline, if extended)

### 🔧 Steps to Run Locally

```bash
# 1. Clone the Repository
git clone https://github.com/your-username/vizdash.git
cd vizdash

# 2. Create Virtual Environment
python -m venv env
source env/bin/activate  # on Windows: env\Scripts\activate

# 3. Install Dependencies
pip install -r requirements.txt

# 4. Run Migrations
python manage.py makemigrations
python manage.py migrate

# 5. (Optional) Load Sample Data
python manage.py loaddata jsondata.json

# 6. Run Server
python manage.py runserver

Then open: http://127.0.0.1:8000

🔌 API Endpoints
📥 1. Get Insights
      GET /api/insights/
      Optional Query Params: end_year, topic, sector, region, country, etc.

📈 2. Get Chart Data
      GET /api/chart-data/?var=intensity
      Query Param: var = intensity | likelihood | relevance

🎛️ 3. Get Filter Options
      GET /api/filters/
      Returns unique values for all dropdown filters (region, sector, PESTLE, etc.)
