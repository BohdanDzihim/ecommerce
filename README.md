# 🛒 Full-Stack E-Commerce Platform
*Built with Next.js, Django REST Framework, PostgreSQL*

A modern, responsive e-commerce platform with user authentication, live product search, and shopping cart functionality. Built using a React/Next.js front-end and a Django REST API back-end, powered by PostgreSQL.
## Features
- **✅ JWT Authentication**: Secure login/logout via `djangorestframework-simplejwt`, protecting private endpoints.
- **🔍 Live Product Search**: Real-time suggestions with images as the user types.
- **🛒 Persistent Shopping Cart**: Cart contents survive page refresh and return visits (via local storage).
- **📱 Responsive UI Design**: Clean Tailwind CSS design across desktop and mobile.
- **⚙️ Modern Tech Stack**: Combines SSR (Next.js) with Django APIs for a performant full-stack experience.
## Tech Stack
- **Front-End**: Next.js (React + TypeScript), Tailwind CSS, React Icons
- **Back-End**: Django, Django REST Framework, Simple JWT
- **Database**: PostgreSQL
- **Auth**: JSON Web Tokens (via Simple JWT)
- **Dev Tools**: Python, Node.js, npm, Virtualenv
## 🔧 Installation and Setup
To run this project locally, you'll need to set up both the back-end (Django) and front-end (Next.js).  
Make sure the following are installed on your system:
- Python 3.10+
- Node.js & npm
- PostgreSQL

---

### Backend (Django REST API)
1. **Clone the repository** and navigate to the backend directory:
```bash
git clone https://github.com/BohdanDzihim/ecommerce.git
cd ecommerce/backend
```
2. **Create and activate a virtual environment**:

**Linux/macOS**:
```bash
python3 -m venv venv
source venv/bin/activate
```
**Windows**:
```bash
python -m venv venv
venv\Scripts\activate
```
3. **Install dependencies**:
```bash
pip install -r requirements.txt
```
4. **Configure the database**: 
- Create a PostgreSQL database and a user.
- Update the Django settings `settings.py` or use a .env file to set:
  - DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT
5. **Run migrations**:
```bash
python manage.py migrate
```
6. *(Optional)* **Create a superuser**:
```bash
python manage.py createsuperuser
```
7. **Run the backend server**:
```bash
python manage.py runserver
```
> API will run at `http://localhost:8000/`
---
### Frontend (Next.js)
1. Open a new terminal and navigate to the front-end directory:
```bash
cd ecommerce/frontend
```
2. **Install dependencies**:
```bash
npm install
```
3. **Configure environment**: 
- Make sure the frontend can reach the backend API.
- You can set:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
4. **Start the frontend dev server**:
```bash
npm run dev
```
> The frontend will be available at `http://localhost:3000/`
Now you can register, log in, browse products, and manage your cart. The frontend communicates with the Django API for data.
## Project Status
**In Progress**: This e-commerce app is under active development (2025). The core features listed above are implemented, but additional functionalities (such as order checkout, payment integration, admin dashboards, etc.) may be in development. Bug fixes and refinements are ongoing. Feel free to explore the code; feedback and suggestions are welcome, although major contributions might be held off until the project reaches a stable state. 
