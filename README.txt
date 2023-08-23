# Project Name
Data Filter

## Description
Data Filter is a web application that allows users to to be able to interact, extract and filter data from the table based on their condition. It is built using Python Django for the backend and HTML, CSS and Javascript for the frontend.

## Installation
Follow the instructions below to get the project up and running on your local machine.
These instructions will guide you through setting up and running the Django web application on your local computer.

Prerequisites:
Python (version 3.11.3 or higher)
pip (Python package manager)
Git

1. Clone the Repository
Clone the project repository from the source control repository using Git: git clone https://github.com/dineshbellamkonda12/JLR-Coding-Challenge-Data-Viewer.git

2. Create and Activate Virtual Environment (Optional but Recommended)
Navigate to the project directory and create a virtual environment using below commands:

cd your_project_directory
python -m venv venv

Activate the virtual environment:
On Windows:
venv\Scripts\activate
On macOS and Linux:
source venv/bin/activate

3. Install Dependencies
Install the required Python packages listed in the requirements.txt file:
pip install -r requirements.txt

4. Run Migrations
Apply the database migrations to create the required tables:
python manage.py migrate

5. Import Data 
Run import_data.py script that inserts CSV data into the inbuilt Django SQLite database:
python import_data.py

6. Run the Development Server
Start the Django development server to run the application:
python manage.py runserver

## Repository Information
vehicle_tests -> Django Project
test_app -> Django App 