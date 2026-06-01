"""
Database setup — SQLAlchemy models
"""
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()
        _seed_colleges()
        _seed_scholarships()
        _seed_courses()
        _seed_careers()
    print("✅ Database ready")


# ─── Models ───────────────────────────────────────────────────

class User(db.Model):
    __tablename__ = "users"
    id            = db.Column(db.Integer, primary_key=True)
    name          = db.Column(db.String(120), nullable=False)
    email         = db.Column(db.String(200), unique=True, nullable=False)
    phone         = db.Column(db.String(20))
    stream        = db.Column(db.String(60))
    password_hash = db.Column(db.String(256))
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)
    is_admin      = db.Column(db.Boolean, default=False)

    # Academic profile (one-to-one)
    academics = db.relationship("AcademicProfile", backref="user", uselist=False)
    predictions = db.relationship("Prediction", backref="user")

    def set_password(self, pw):  self.password_hash = generate_password_hash(pw)
    def check_password(self, pw): return check_password_hash(self.password_hash, pw)

    def to_dict(self):
        return {
            "id": self.id, "name": self.name, "email": self.email,
            "phone": self.phone, "stream": self.stream,
            "is_admin": self.is_admin,
            "created_at": self.created_at.isoformat(),
        }


class AcademicProfile(db.Model):
    __tablename__ = "academic_profiles"
    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True)
    p10         = db.Column(db.Float)
    p12         = db.Column(db.Float)
    cgpa        = db.Column(db.Float)
    entrance_score = db.Column(db.Float)
    entrance_exam  = db.Column(db.String(40))
    category    = db.Column(db.String(20))
    branch      = db.Column(db.String(80))
    state       = db.Column(db.String(60))
    extra       = db.Column(db.String(80))
    updated_at  = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {k: v for k, v in self.__dict__.items() if not k.startswith("_")}


class Prediction(db.Model):
    __tablename__ = "predictions"
    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey("users.id"))
    overall     = db.Column(db.Float)
    lr_score    = db.Column(db.Float)
    rf_score    = db.Column(db.Float)
    log_score   = db.Column(db.Float)
    rank        = db.Column(db.Integer)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id, "overall": self.overall,
            "lr_score": self.lr_score, "rf_score": self.rf_score,
            "log_score": self.log_score, "rank": self.rank,
            "created_at": self.created_at.isoformat(),
        }


class College(db.Model):
    __tablename__ = "colleges"
    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(200), nullable=False)
    location    = db.Column(db.String(200))
    state       = db.Column(db.String(80))
    stream      = db.Column(db.String(80))
    rating      = db.Column(db.Float)
    fees_min    = db.Column(db.Integer)   # per year in INR
    fees_max    = db.Column(db.Integer)
    avg_package = db.Column(db.Float)     # LPA
    max_package = db.Column(db.Float)
    cutoff_jee  = db.Column(db.String(80))
    cutoff_pct  = db.Column(db.Float)     # min 12th % required
    seats_total = db.Column(db.Integer)
    nirf_rank   = db.Column(db.Integer)
    established = db.Column(db.Integer)
    website     = db.Column(db.String(200))
    placement_pct = db.Column(db.Float)  # % placed

    def to_dict(self):
        return {
            "id": self.id, "name": self.name, "location": self.location,
            "state": self.state, "stream": self.stream, "rating": self.rating,
            "fees": f"₹{self.fees_min//100000:.1f}L/yr" if self.fees_min else "N/A",
            "fees_min": self.fees_min, "fees_max": self.fees_max,
            "avg_package": f"₹{self.avg_package} LPA",
            "max_package": f"₹{self.max_package} LPA",
            "cutoff_jee": self.cutoff_jee, "cutoff_pct": self.cutoff_pct,
            "nirf_rank": self.nirf_rank, "seats": self.seats_total,
            "placement_pct": self.placement_pct,
            "website": self.website,
        }


class Scholarship(db.Model):
    __tablename__ = "scholarships"
    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(200))
    provider    = db.Column(db.String(100))
    amount_yr   = db.Column(db.Integer)   # INR per year
    deadline    = db.Column(db.String(60))
    min_marks   = db.Column(db.Float)     # min 12th %
    categories  = db.Column(db.String(100))  # General,OBC,SC,ST — comma sep
    stream      = db.Column(db.String(80))   # Engineering,Medical,All
    income_limit = db.Column(db.Integer)     # max family income INR
    description = db.Column(db.Text)
    icon        = db.Column(db.String(10))
    apply_link  = db.Column(db.String(300))

    def to_dict(self):
        return {
            "id": self.id, "name": self.name, "provider": self.provider,
            "amount": f"₹{self.amount_yr:,}/yr", "amount_raw": self.amount_yr,
            "deadline": self.deadline, "min_marks": self.min_marks,
            "categories": self.categories.split(","),
            "stream": self.stream, "income_limit": self.income_limit,
            "description": self.description, "icon": self.icon,
            "apply_link": self.apply_link,
        }


class Course(db.Model):
    __tablename__ = "courses"
    id          = db.Column(db.Integer, primary_key=True)
    title       = db.Column(db.String(200))
    platform    = db.Column(db.String(80))
    duration    = db.Column(db.String(40))
    level       = db.Column(db.String(30))
    rating      = db.Column(db.Float)
    price_inr   = db.Column(db.Integer)   # 0 = Free
    topic       = db.Column(db.String(80))  # AI, Web Dev, Data Science etc.
    icon        = db.Column(db.String(10))
    badge       = db.Column(db.String(30))
    url         = db.Column(db.String(300))

    def to_dict(self):
        return {
            "id": self.id, "title": self.title, "platform": self.platform,
            "duration": self.duration, "level": self.level, "rating": self.rating,
            "price": "Free" if self.price_inr == 0 else f"₹{self.price_inr:,}",
            "price_raw": self.price_inr, "topic": self.topic,
            "icon": self.icon, "badge": self.badge, "url": self.url,
        }


class Career(db.Model):
    __tablename__ = "careers"
    id            = db.Column(db.Integer, primary_key=True)
    title         = db.Column(db.String(120))
    icon          = db.Column(db.String(10))
    salary_india_min = db.Column(db.Float)   # LPA
    salary_india_max = db.Column(db.Float)
    salary_us_min    = db.Column(db.Float)   # USD k/yr
    salary_us_max    = db.Column(db.Float)
    growth_pct    = db.Column(db.Float)      # YoY %
    demand        = db.Column(db.String(20)) # High/Medium/Low
    top_companies = db.Column(db.String(300))
    skills        = db.Column(db.String(300))
    description   = db.Column(db.Text)
    stream        = db.Column(db.String(80))

    def to_dict(self):
        return {
            "id": self.id, "title": self.title, "icon": self.icon,
            "salary_india": f"₹{self.salary_india_min}–{self.salary_india_max} LPA",
            "salary_india_min": self.salary_india_min,
            "salary_india_max": self.salary_india_max,
            "salary_us": f"${self.salary_us_min}k–{self.salary_us_max}k/yr",
            "growth": f"{self.growth_pct}% growth/yr",
            "demand": self.demand,
            "top_companies": self.top_companies.split(","),
            "skills": self.skills.split(","),
            "description": self.description,
        }


# ─── Seed Data ────────────────────────────────────────────────

def _seed_colleges():
    if College.query.count() > 0:
        return
    colleges = [
        College(name="IIT Bombay", location="Mumbai, Maharashtra", state="Maharashtra", stream="Engineering", rating=4.9, fees_min=250000, fees_max=280000, avg_package=28.0, max_package=1.5*100, cutoff_jee="JEE Adv: Top 1500", cutoff_pct=95, seats_total=1000, nirf_rank=3, established=1958, placement_pct=95, website="iitb.ac.in"),
        College(name="IIT Delhi", location="New Delhi, Delhi", state="Delhi", stream="Engineering", rating=4.9, fees_min=240000, fees_max=270000, avg_package=30.0, max_package=2*100, cutoff_jee="JEE Adv: Top 1000", cutoff_pct=96, seats_total=850, nirf_rank=2, established=1961, placement_pct=96, website="iitd.ac.in"),
        College(name="IIT Madras", location="Chennai, Tamil Nadu", state="Tamil Nadu", stream="Engineering", rating=4.9, fees_min=230000, fees_max=260000, avg_package=27.0, max_package=1.8*100, cutoff_jee="JEE Adv: Top 2000", cutoff_pct=95, seats_total=900, nirf_rank=1, established=1959, placement_pct=94, website="iitm.ac.in"),
        College(name="NIT Trichy", location="Tiruchirappalli, Tamil Nadu", state="Tamil Nadu", stream="Engineering", rating=4.6, fees_min=150000, fees_max=180000, avg_package=14.0, max_package=60.0, cutoff_jee="JEE Main: 98%ile", cutoff_pct=92, seats_total=1200, nirf_rank=9, established=1964, placement_pct=89, website="nitt.edu"),
        College(name="DTU Delhi", location="New Delhi, Delhi", state="Delhi", stream="Engineering", rating=4.5, fees_min=150000, fees_max=180000, avg_package=18.0, max_package=80.0, cutoff_jee="JEE Main: 95%ile", cutoff_pct=90, seats_total=1400, nirf_rank=35, established=1941, placement_pct=85, website="dtu.ac.in"),
        College(name="BITS Pilani", location="Pilani, Rajasthan", state="Rajasthan", stream="Engineering", rating=4.8, fees_min=500000, fees_max=550000, avg_package=22.0, max_package=1.2*100, cutoff_jee="BITSAT: 340+", cutoff_pct=90, seats_total=1200, nirf_rank=25, established=1964, placement_pct=90, website="bits-pilani.ac.in"),
        College(name="VIT Vellore", location="Vellore, Tamil Nadu", state="Tamil Nadu", stream="Engineering", rating=4.3, fees_min=200000, fees_max=250000, avg_package=7.0, max_package=42.0, cutoff_jee="VITEEE: Top 10k", cutoff_pct=75, seats_total=8000, nirf_rank=11, established=1984, placement_pct=82, website="vit.ac.in"),
        College(name="NSIT Delhi", location="New Delhi, Delhi", state="Delhi", stream="Engineering", rating=4.4, fees_min=140000, fees_max=160000, avg_package=14.0, max_package=70.0, cutoff_jee="JEE Main: 90%ile", cutoff_pct=88, seats_total=1100, nirf_rank=50, established=1983, placement_pct=83, website="nsut.ac.in"),
        College(name="IIIT Hyderabad", location="Hyderabad, Telangana", state="Telangana", stream="Engineering", rating=4.7, fees_min=300000, fees_max=350000, avg_package=24.0, max_package=1.5*100, cutoff_jee="JEE Main: 98%ile", cutoff_pct=93, seats_total=400, nirf_rank=30, established=1998, placement_pct=93, website="iiit.ac.in"),
        College(name="Manipal Institute of Technology", location="Manipal, Karnataka", state="Karnataka", stream="Engineering", rating=4.2, fees_min=350000, fees_max=400000, avg_package=6.5, max_package=35.0, cutoff_jee="MET: Merit based", cutoff_pct=70, seats_total=6000, nirf_rank=55, established=1957, placement_pct=78, website="manipal.edu"),
        College(name="SRM Institute of Science", location="Chennai, Tamil Nadu", state="Tamil Nadu", stream="Engineering", rating=4.0, fees_min=280000, fees_max=320000, avg_package=5.8, max_package=28.0, cutoff_jee="SRMJEEE: Merit", cutoff_pct=65, seats_total=10000, nirf_rank=41, established=1985, placement_pct=75, website="srmist.edu.in"),
        College(name="Amity University", location="Noida, Uttar Pradesh", state="Uttar Pradesh", stream="Engineering", rating=3.9, fees_min=250000, fees_max=300000, avg_package=5.0, max_package=25.0, cutoff_jee="Merit based", cutoff_pct=60, seats_total=5000, nirf_rank=70, established=2003, placement_pct=72, website="amity.edu"),
        College(name="Thapar Institute", location="Patiala, Punjab", state="Punjab", stream="Engineering", rating=4.3, fees_min=320000, fees_max=360000, avg_package=10.0, max_package=45.0, cutoff_jee="JEE Main: 85%ile", cutoff_pct=82, seats_total=2000, nirf_rank=28, established=1956, placement_pct=86, website="thapar.edu"),
        College(name="COEP Pune", location="Pune, Maharashtra", state="Maharashtra", stream="Engineering", rating=4.2, fees_min=100000, fees_max=130000, avg_package=9.0, max_package=40.0, cutoff_jee="MHT-CET: 95%ile", cutoff_pct=85, seats_total=900, nirf_rank=45, established=1854, placement_pct=80, website="coep.ac.in"),
        College(name="PSG College of Technology", location="Coimbatore, Tamil Nadu", state="Tamil Nadu", stream="Engineering", rating=4.1, fees_min=80000, fees_max=120000, avg_package=6.0, max_package=30.0, cutoff_jee="TNEA: Merit", cutoff_pct=78, seats_total=2500, nirf_rank=60, established=1951, placement_pct=77, website="psgtech.edu"),
    ]
    db.session.add_all(colleges)
    db.session.commit()
    print(f"  ✅ Seeded {len(colleges)} colleges")


def _seed_scholarships():
    if Scholarship.query.count() > 0:
        return
    scholarships = [
        Scholarship(name="Central Sector Scholarship", provider="MHRD / NIC", amount_yr=100000, deadline="Aug 31, 2025", min_marks=80, categories="General,OBC,SC,ST,EWS", stream="All", income_limit=800000, icon="🏛️", description="For top 20 percentile CBSE/State board students. Family income < ₹8L.", apply_link="scholarships.gov.in"),
        Scholarship(name="INSPIRE Scholarship", provider="DST India", amount_yr=80000, deadline="Sep 15, 2025", min_marks=60, categories="General,OBC,SC,ST,EWS", stream="Science", income_limit=0, icon="💡", description="For Science stream students pursuing natural/basic sciences. 60%+ in Class 12.", apply_link="online-inspire.gov.in"),
        Scholarship(name="Pragati Scholarship", provider="AICTE", amount_yr=50000, deadline="Oct 1, 2025", min_marks=0, categories="General,OBC,SC,ST,EWS", stream="Engineering", income_limit=800000, icon="🌟", description="For girls pursuing technical education (B.Tech/Diploma). Income < ₹8L.", apply_link="aicte-pragati-saksham-gov.in"),
        Scholarship(name="Sitaram Jindal Scholarship", provider="Sitaram Jindal Foundation", amount_yr=24000, deadline="Sep 30, 2025", min_marks=55, categories="General,OBC,SC,ST", stream="All", income_limit=400000, icon="🏆", description="Meritorious students from economically weaker sections. Income < ₹4L.", apply_link="sitaramjindalfoundation.org"),
        Scholarship(name="National Talent Search (NTS)", provider="NCERT", amount_yr=15000, deadline="Rolling", min_marks=0, categories="General,OBC,SC,ST,EWS", stream="All", income_limit=0, icon="📚", description="For NTS Examination qualified students. ₹1,250/month at Class 11–12 level.", apply_link="ncert.nic.in"),
        Scholarship(name="PM Scholarship Scheme", provider="RPMS / KSB", amount_yr=36000, deadline="Aug 15, 2025", min_marks=60, categories="General", stream="Engineering", income_limit=0, icon="🎓", description="For children of Ex-Servicemen and Ex-Coast Guard personnel.", apply_link="ksb.gov.in"),
        Scholarship(name="Reliance Foundation Scholarship", provider="Reliance Foundation", amount_yr=400000, deadline="Mar 31, 2025", min_marks=60, categories="General,OBC,SC,ST,EWS", stream="Engineering", income_limit=1500000, icon="💎", description="For UG students in STEM. Up to ₹4L/yr including mentorship.", apply_link="reliancefoundation.org"),
        Scholarship(name="Tata Capital Pankh Scholarship", provider="Tata Capital", amount_yr=50000, deadline="Sep 15, 2025", min_marks=60, categories="General,OBC,SC,ST,EWS", stream="All", income_limit=400000, icon="🦅", description="For students from low-income families pursuing professional courses.", apply_link="tatacapital.com/pankh"),
    ]
    db.session.add_all(scholarships)
    db.session.commit()
    print(f"  ✅ Seeded {len(scholarships)} scholarships")


def _seed_courses():
    if Course.query.count() > 0:
        return
    courses = [
        Course(title="Machine Learning A-Z", platform="Udemy", duration="40 hrs", level="Beginner", rating=4.8, price_inr=499, topic="AI/ML", icon="🤖", badge="Bestseller", url="udemy.com/machine-learning-az"),
        Course(title="Full Stack Web Dev Bootcamp", platform="Coursera", duration="6 months", level="Intermediate", rating=4.7, price_inr=1999, topic="Web Dev", icon="🌐", badge="Popular", url="coursera.org/fullstack"),
        Course(title="Data Science with Python", platform="edX", duration="3 months", level="Beginner", rating=4.6, price_inr=0, topic="Data Science", icon="📊", badge="Free", url="edx.org/data-science"),
        Course(title="AWS Cloud Practitioner", platform="AWS Training", duration="20 hrs", level="Beginner", rating=4.9, price_inr=2999, topic="Cloud", icon="☁️", badge="Certified", url="aws.amazon.com/training"),
        Course(title="Ethical Hacking Complete Course", platform="Udemy", duration="35 hrs", level="Intermediate", rating=4.5, price_inr=649, topic="Cybersecurity", icon="🔒", badge="Hot", url="udemy.com/ethical-hacking"),
        Course(title="React Native – Build Apps", platform="Udemy", duration="28 hrs", level="Intermediate", rating=4.6, price_inr=499, topic="Mobile Dev", icon="📱", badge="New", url="udemy.com/react-native"),
        Course(title="Deep Learning Specialization", platform="Coursera", duration="4 months", level="Advanced", rating=4.9, price_inr=3500, topic="AI/ML", icon="🧠", badge="Top Rated", url="coursera.org/deeplearning"),
        Course(title="DSA for Placements", platform="Coding Ninjas", duration="60 hrs", level="Intermediate", rating=4.8, price_inr=4999, topic="CS Fundamentals", icon="📐", badge="Placement", url="codingninjas.com/dsa"),
        Course(title="Google UX Design", platform="Coursera", duration="6 months", level="Beginner", rating=4.7, price_inr=1999, topic="Design", icon="🎨", badge="Google", url="coursera.org/google-ux"),
        Course(title="Blockchain & Web3", platform="Udemy", duration="22 hrs", level="Intermediate", rating=4.4, price_inr=799, topic="Blockchain", icon="⛓️", badge="Trending", url="udemy.com/blockchain"),
        Course(title="GATE CS Preparation", platform="NPTEL", duration="6 months", level="Advanced", rating=4.6, price_inr=0, topic="GATE", icon="🎯", badge="Free", url="nptel.ac.in"),
        Course(title="Digital Marketing Complete", platform="Google", duration="40 hrs", level="Beginner", rating=4.5, price_inr=0, topic="Marketing", icon="📣", badge="Free", url="skillshop.google.com"),
    ]
    db.session.add_all(courses)
    db.session.commit()
    print(f"  ✅ Seeded {len(courses)} courses")


def _seed_careers():
    if Career.query.count() > 0:
        return
    careers = [
        Career(title="Software Engineer", icon="💻", salary_india_min=8, salary_india_max=45, salary_us_min=90, salary_us_max=200, growth_pct=25, demand="Very High", top_companies="Google,Microsoft,Amazon,Flipkart,Infosys", skills="DSA,System Design,Python,Java,SQL", description="Build scalable software systems. Highest-hiring role in tech globally.", stream="Engineering"),
        Career(title="AI / ML Engineer", icon="🧠", salary_india_min=12, salary_india_max=60, salary_us_min=120, salary_us_max=250, growth_pct=38, demand="Very High", top_companies="Google DeepMind,OpenAI,Meta AI,Nvidia,Anthropic", skills="Python,TensorFlow,PyTorch,Math,Statistics", description="Design and deploy machine learning models and AI pipelines. Fastest growing field.", stream="Engineering"),
        Career(title="Data Scientist", icon="📊", salary_india_min=10, salary_india_max=50, salary_us_min=100, salary_us_max=200, growth_pct=29, demand="High", top_companies="Amazon,Netflix,Zomato,CRED,Razorpay", skills="Python,SQL,Statistics,Tableau,Spark", description="Extract insights from data to drive business decisions.", stream="Engineering"),
        Career(title="Cybersecurity Analyst", icon="🔒", salary_india_min=6, salary_india_max=35, salary_us_min=80, salary_us_max=160, growth_pct=32, demand="High", top_companies="Palo Alto,CrowdStrike,IBM Security,ISRO,CERT-In", skills="Networking,Ethical Hacking,VAPT,Linux,Python", description="Protect organizations from digital threats. Critical shortage globally.", stream="Engineering"),
        Career(title="Cloud Architect", icon="☁️", salary_india_min=15, salary_india_max=70, salary_us_min=130, salary_us_max=280, growth_pct=27, demand="Very High", top_companies="AWS,Google Cloud,Azure,Accenture,TCS", skills="AWS,GCP,Azure,Kubernetes,DevOps,Terraform", description="Design enterprise-scale cloud infrastructure. Premium salaries.", stream="Engineering"),
        Career(title="Product Manager", icon="📱", salary_india_min=18, salary_india_max=80, salary_us_min=140, salary_us_max=300, growth_pct=22, demand="High", top_companies="Google,Amazon,Swiggy,PhonePe,Paytm", skills="Strategy,Analytics,SQL,Leadership,UX,Roadmapping", description="Lead product vision from ideation to launch. High impact, premium pay.", stream="Engineering"),
        Career(title="Embedded / VLSI Engineer", icon="⚡", salary_india_min=5, salary_india_max=25, salary_us_min=70, salary_us_max=150, growth_pct=16, demand="Medium", top_companies="Qualcomm,Intel,Samsung,ISRO,Texas Instruments", skills="Verilog,VHDL,C,ARM,Microcontrollers", description="Design chips and embedded systems. High demand in semiconductor sector.", stream="Engineering"),
        Career(title="Quantitative Analyst", icon="📈", salary_india_min=15, salary_india_max=80, salary_us_min=120, salary_us_max=300, growth_pct=20, demand="Medium", top_companies="Goldman Sachs,JP Morgan,Jane Street,Citadel,D.E. Shaw", skills="Math,Statistics,Python,R,Financial Modeling", description="Apply math/CS to financial markets. Among highest-paid roles globally.", stream="Engineering"),
        Career(title="Game Developer", icon="🎮", salary_india_min=5, salary_india_max=30, salary_us_min=75, salary_us_max=170, growth_pct=18, demand="Medium", top_companies="Ubisoft,Activision,Dream11,Nazara,MPL", skills="Unity,Unreal,C++,C#,Game Physics,3D Math", description="Build interactive games for PC, mobile and console. Growing Indian market.", stream="Engineering"),
        Career(title="Robotics Engineer", icon="🤖", salary_india_min=6, salary_india_max=30, salary_us_min=90, salary_us_max=180, growth_pct=24, demand="High", top_companies="Boston Dynamics,ISRO,Tesla,Ola Electric,ABB Robotics", skills="ROS,C++,Python,Control Systems,Computer Vision", description="Build autonomous robots for industry, defense and healthcare.", stream="Engineering"),
    ]
    db.session.add_all(careers)
    db.session.commit()
    print(f"  ✅ Seeded {len(careers)} careers")
