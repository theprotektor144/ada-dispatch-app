"""
ADA Wedge A (Multi-tenant SaaS) - SINGLE FILE BACKEND
Features:
- Tenants
- Users with roles: OWNER / ADMIN / DISPATCHER
- JWT auth
- Tenant-scoped carrier cost profiles
- Profit-first recommendation + negotiation script
- Tenant-scoped recommendation logs
- Role-based access control:
  - OWNER/ADMIN: manage users, manage profiles
  - DISPATCHER: can recommend + view logs + view profiles (read)
"""

import os
from datetime import datetime, timedelta
from typing import Optional, Literal, Dict, Any, List, Tuple
from dataclasses import dataclass

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel, Field, EmailStr

from sqlalchemy import (
    create_engine, Integer, String, Float, DateTime, ForeignKey, Text, JSON, UniqueConstraint
)
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Mapped, mapped_column, relationship, Session

from passlib.context import CryptContext
from jose import jwt, JWTError


# -----------------------------
# Config (set env vars in prod)
# -----------------------------
DATABASE_URL = os.getenv("ADA_DATABASE_URL", "sqlite:////tmp/ada.db")

SECRET_KEY = os.getenv("ADA_SECRET_KEY", "CHANGE_ME_TO_A_LONG_RANDOM_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ADA_TOKEN_MINUTES", "1440"))  # 24 hours

# -----------------------------
# DB setup
# -----------------------------
engine_kwargs = {}
if DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------------------
# Models
# -----------------------------
Role = Literal["OWNER", "ADMIN", "DISPATCHER"]

class Tenant(Base):
    __tablename__ = "tenants"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, index=True)

    users = relationship("User", back_populates="tenant", cascade="all, delete-orphan")
    profiles = relationship("CarrierCostProfile", back_populates="tenant", cascade="all, delete-orphan")

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    tenant_id: Mapped[int] = mapped_column(ForeignKey("tenants.id"), index=True)

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="OWNER")  # OWNER|ADMIN|DISPATCHER
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    tenant = relationship("Tenant", back_populates="users")

class CarrierCostProfile(Base):
    __tablename__ = "carrier_cost_profiles"
    __table_args__ = (UniqueConstraint("tenant_id", "profile_id", name="uq_profile_per_tenant"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    tenant_id: Mapped[int] = mapped_column(ForeignKey("tenants.id"), index=True)

    profile_id: Mapped[str] = mapped_column(String(80), index=True)
    display_name: Mapped[str] = mapped_column(String(120))

    driver_pay_per_mile: Mapped[float] = mapped_column(Float, default=0.70)
    maintenance_per_mile: Mapped[float] = mapped_column(Float, default=0.15)
    insurance_per_mile: Mapped[float] = mapped_column(Float, default=0.12)
    tires_per_mile: Mapped[float] = mapped_column(Float, default=0.04)
    permits_tolls_per_mile: Mapped[float] = mapped_column(Float, default=0.05)
    other_variable_per_mile: Mapped[float] = mapped_column(Float, default=0.05)

    fixed_costs_per_day: Mapped[float] = mapped_column(Float, default=200.0)
    target_miles_per_day: Mapped[float] = mapped_column(Float, default=450.0)

    mpg: Mapped[float] = mapped_column(Float, default=6.5)
    fuel_price_by_region: Mapped[dict] = mapped_column(JSON, default=dict)

    min_margin_percent: Mapped[float] = mapped_column(Float, default=0.15)
    preferred_margin_percent: Mapped[float] = mapped_column(Float, default=0.25)

    max_deadhead_miles: Mapped[float] = mapped_column(Float, default=150.0)
    block_brokers: Mapped[dict] = mapped_column(JSON, default=dict)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    tenant = relationship("Tenant", back_populates="profiles")

class RecommendationLog(Base):
    __tablename__ = "recommendation_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    tenant_id: Mapped[int] = mapped_column(ForeignKey("tenants.id"), index=True)
    user_email: Mapped[str] = mapped_column(String(255), index=True)
    user_role: Mapped[str] = mapped_column(String(20), index=True)

    profile_id: Mapped[str] = mapped_column(String(80), index=True)
    broker_name: Mapped[str] = mapped_column(String(255), index=True)

    origin_city: Mapped[str] = mapped_column(String(120))
    origin_state: Mapped[str] = mapped_column(String(10))
    dest_city: Mapped[str] = mapped_column(String(120))
    dest_state: Mapped[str] = mapped_column(String(10))

    equipment_type: Mapped[str] = mapped_column(String(40))

    loaded_miles: Mapped[float] = mapped_column(Float)
    deadhead_miles: Mapped[float] = mapped_column(Float)
    offered_total_rate: Mapped[float] = mapped_column(Float)
    fuel_region: Mapped[str] = mapped_column(String(60))

    decision: Mapped[str] = mapped_column(String(20))
    offered_rpm: Mapped[float] = mapped_column(Float)
    break_even_rpm: Mapped[float] = mapped_column(Float)
    target_rpm: Mapped[float] = mapped_column(Float)
    projected_profit: Mapped[float] = mapped_column(Float)
    projected_margin_percent: Mapped[float] = mapped_column(Float)

    negotiation_script: Mapped[str] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


Base.metadata.create_all(bind=engine)

# -----------------------------
# Auth helpers
# -----------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)

def create_access_token(*, sub: str, tenant_id: int, role: str, expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES) -> str:
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    payload = {"sub": sub, "tenant_id": tenant_id, "role": role, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    payload = decode_token(token)
    email = payload.get("sub")
    tenant_id = payload.get("tenant_id")
    role = payload.get("role")
    if not email or tenant_id is None or not role:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = db.query(User).filter(User.email == email).first()
    if not user or user.tenant_id != tenant_id:
        raise HTTPException(status_code=401, detail="User not found / tenant mismatch")
    return user

def require_role(allowed: set[str]):
    def _guard(user: User = Depends(get_current_user)) -> User:
        if user.role not in allowed:
            raise HTTPException(status_code=403, detail=f"Requires role: {', '.join(sorted(allowed))}")
        return user
    return _guard


# -----------------------------
# Pricing / recommendation logic
# -----------------------------
@dataclass
class CostBreakdown:
    fuel_cost: float
    variable_cost: float
    fixed_allocated: float
    total_cost: float

def _fuel_price(profile: CarrierCostProfile, region: str) -> float:
    prices = profile.fuel_price_by_region or {}
    return float(prices.get(region, prices.get("National", 3.85)))

def compute_costs(profile: CarrierCostProfile, req: dict) -> CostBreakdown:
    total_miles = float(req["loaded_miles"]) + float(req.get("deadhead_miles", 0))

    f_price = _fuel_price(profile, req.get("fuel_region", "National"))
    gallons = total_miles / float(profile.mpg)
    fuel_cost = gallons * f_price

    var_per_mile = (
        float(profile.driver_pay_per_mile)
        + float(profile.maintenance_per_mile)
        + float(profile.insurance_per_mile)
        + float(profile.tires_per_mile)
        + float(profile.permits_tolls_per_mile)
        + float(profile.other_variable_per_mile)
    )
    variable_cost = var_per_mile * total_miles

    fixed_per_mile = float(profile.fixed_costs_per_day) / float(profile.target_miles_per_day)
    fixed_allocated = fixed_per_mile * total_miles

    total_cost = fuel_cost + variable_cost + fixed_allocated
    return CostBreakdown(fuel_cost=fuel_cost, variable_cost=variable_cost, fixed_allocated=fixed_allocated, total_cost=total_cost)

def offered_rpm(req: dict) -> float:
    return float(req["offered_total_rate"]) / float(req["loaded_miles"])

def break_even_rpm(profile: CarrierCostProfile, req: dict) -> float:
    costs = compute_costs(profile, req)
    return costs.total_cost / float(req["loaded_miles"])

def target_rpm(profile: CarrierCostProfile, req: dict) -> float:
    be = break_even_rpm(profile, req)
    return be * (1.0 + float(profile.preferred_margin_percent))

def decision_logic(profile: CarrierCostProfile, req: dict) -> Tuple[str, list[str]]:
    reasons: list[str] = []
    block = (profile.block_brokers or {}).get(req["broker_name"])
    if block:
        reasons.append(f"Broker is blocked: {block}")
        return "NO-GO", reasons

    dead = float(req.get("deadhead_miles", 0))
    if dead > float(profile.max_deadhead_miles):
        reasons.append(f"Deadhead {dead:.0f}mi exceeds soft cap {profile.max_deadhead_miles:.0f}mi (review)")

    be = break_even_rpm(profile, req)
    off = offered_rpm(req)
    min_rpm = be * (1.0 + float(profile.min_margin_percent))

    if off >= min_rpm and dead <= float(profile.max_deadhead_miles):
        reasons.append(f"Offered RPM ${off:.2f} meets minimum ${min_rpm:.2f}")
        return "GO", reasons

    if off < be:
        reasons.append(f"Offered RPM ${off:.2f} is below break-even ${be:.2f}")
        return "NO-GO", reasons

    reasons.append(f"Offered RPM ${off:.2f} is between break-even ${be:.2f} and minimum ${min_rpm:.2f}")
    return "REVIEW", reasons

def negotiation_script(req: dict, be_rpm_value: float, tgt_rpm_value: float) -> str:
    off_r = offered_rpm(req)
    return (
        f"Hi — thanks for sending this over. For {req['origin_city']}, {req['origin_state']} → "
        f"{req['dest_city']}, {req['dest_state']} ({float(req['loaded_miles']):.0f} loaded mi, {float(req.get('deadhead_miles',0)):.0f} deadhead), "
        f"we’re currently at ${off_r:.2f}/mi (${float(req['offered_total_rate']):,.0f} total). "
        f"Given operating costs and deadhead, we need ${be_rpm_value:.2f}/mi to break even. "
        f"If you can do ${tgt_rpm_value:.2f}/mi (${tgt_rpm_value * float(req['loaded_miles']):,.0f} total), we can confirm and roll now. "
        f"Can you check with your customer and get me as close as possible?"
    )


# -----------------------------
# API schemas
# -----------------------------
class RegisterRequest(BaseModel):
    tenant_name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=8)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class CreateUserRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: Literal["ADMIN", "DISPATCHER"]  # creation limited; OWNER is only first user

class UserOut(BaseModel):
    email: EmailStr
    role: str
    created_at: str

class ChangeRoleRequest(BaseModel):
    role: Literal["ADMIN", "DISPATCHER"]

class ProfileIn(BaseModel):
    profile_id: str
    display_name: str

    driver_pay_per_mile: float = 0.70
    maintenance_per_mile: float = 0.15
    insurance_per_mile: float = 0.12
    tires_per_mile: float = 0.04
    permits_tolls_per_mile: float = 0.05
    other_variable_per_mile: float = 0.05

    fixed_costs_per_day: float = 200.0
    target_miles_per_day: float = 450.0

    mpg: float = 6.5
    fuel_price_by_region: dict = Field(default_factory=lambda: {
        "National": 3.85, "Northeast": 4.05, "Southeast": 3.65, "Midwest": 3.75, "Southwest": 3.70, "West": 4.25
    })

    min_margin_percent: float = 0.15
    preferred_margin_percent: float = 0.25
    max_deadhead_miles: float = 150.0

    block_brokers: dict = Field(default_factory=dict)

class LoadRequest(BaseModel):
    profile_id: str
    origin_city: str
    origin_state: str
    dest_city: str
    dest_state: str

    equipment_type: str = "Van"
    broker_name: str

    loaded_miles: float
    deadhead_miles: float = 0.0
    offered_total_rate: float
    fuel_region: str = "National"
    notes: Optional[str] = None

class RecommendationOut(BaseModel):
    decision: str
    reasons: list[str]
    offered_rpm: float
    break_even_rpm: float
    target_rpm: float
    target_total_rate: float
    projected_revenue: float
    projected_total_cost: float
    projected_profit: float
    projected_margin_percent: float
    negotiation_script: str


# -----------------------------
# App
# -----------------------------
app = FastAPI(title="ADA Wedge A - Multi-tenant + Roles (Single-file)", version="0.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def home():
    return {"status": "ok"}

@app.get("/health")
def health():
    return {"status": "ok", "utc": datetime.utcnow().isoformat()}

# ---- Auth ----
@app.post("/auth/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    # create or fetch tenant
    tenant = db.query(Tenant).filter(Tenant.name == req.tenant_name).first()
    if not tenant:
        tenant = Tenant(name=req.tenant_name)
        db.add(tenant)
        db.commit()
        db.refresh(tenant)

    # email must be unique across system
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # first user is OWNER for this tenant
    user = User(
        tenant_id=tenant.id,
        email=req.email,
        password_hash=hash_password(req.password),
        role="OWNER"
    )
    db.add(user)
    db.commit()

    token = create_access_token(sub=user.email, tenant_id=user.tenant_id, role=user.role)
    return TokenResponse(access_token=token)

@app.post("/auth/login", response_model=TokenResponse)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(sub=user.email, tenant_id=user.tenant_id, role=user.role)
    return TokenResponse(access_token=token)

@app.get("/me")
def me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tenant = db.query(Tenant).filter(Tenant.id == current_user.tenant_id).first()
    return {
        "email": current_user.email,
        "role": current_user.role,
        "tenant": tenant.name if tenant else None,
        "tenant_id": current_user.tenant_id
    }

# ---- Users (OWNER/ADMIN only) ----
@app.get("/tenant/users", response_model=list[UserOut])
def list_users(current_user: User = Depends(require_role({"OWNER", "ADMIN"})), db: Session = Depends(get_db)):
    users = db.query(User).filter(User.tenant_id == current_user.tenant_id).order_by(User.created_at.asc()).all()
    return [
        UserOut(email=u.email, role=u.role, created_at=u.created_at.isoformat())
        for u in users
    ]

@app.post("/tenant/users", response_model=dict)
def create_user(payload: CreateUserRequest, current_user: User = Depends(require_role({"OWNER", "ADMIN"})), db: Session = Depends(get_db)):
    # Prevent creating OWNER via this endpoint
    if payload.role not in ("ADMIN", "DISPATCHER"):
        raise HTTPException(status_code=400, detail="Role must be ADMIN or DISPATCHER")

    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    u = User(
        tenant_id=current_user.tenant_id,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role
    )
    db.add(u)
    db.commit()
    return {"ok": True, "email": u.email, "role": u.role}

@app.patch("/tenant/users/{email}", response_model=dict)
def change_role(email: str, payload: ChangeRoleRequest, current_user: User = Depends(require_role({"OWNER"})), db: Session = Depends(get_db)):
    # Only OWNER can change roles (keeps governance simple)
    u = db.query(User).filter(User.email == email, User.tenant_id == current_user.tenant_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found in your tenant")
    if u.role == "OWNER":
        raise HTTPException(status_code=400, detail="Cannot change OWNER role")
    u.role = payload.role
    db.commit()
    return {"ok": True, "email": u.email, "role": u.role}

@app.delete("/tenant/users/{email}", response_model=dict)
def delete_user(email: str, current_user: User = Depends(require_role({"OWNER"})), db: Session = Depends(get_db)):
    u = db.query(User).filter(User.email == email, User.tenant_id == current_user.tenant_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found in your tenant")
    if u.role == "OWNER":
        raise HTTPException(status_code=400, detail="Cannot delete OWNER")
    db.delete(u)
    db.commit()
    return {"ok": True}

# ---- Profiles ----
@app.get("/profiles")
def list_profiles(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = (
        db.query(CarrierCostProfile)
        .filter(CarrierCostProfile.tenant_id == current_user.tenant_id)
        .order_by(CarrierCostProfile.profile_id.asc())
        .all()
    )
    return [{
        "profile_id": r.profile_id,
        "display_name": r.display_name,
        "mpg": r.mpg,
        "min_margin_percent": r.min_margin_percent,
        "preferred_margin_percent": r.preferred_margin_percent,
        "max_deadhead_miles": r.max_deadhead_miles,
    } for r in rows]

@app.get("/profiles/{profile_id}")
def get_profile(profile_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    r = (
        db.query(CarrierCostProfile)
        .filter(CarrierCostProfile.tenant_id == current_user.tenant_id, CarrierCostProfile.profile_id == profile_id)
        .first()
    )
    if not r:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {
        "profile_id": r.profile_id,
        "display_name": r.display_name,
        "driver_pay_per_mile": r.driver_pay_per_mile,
        "maintenance_per_mile": r.maintenance_per_mile,
        "insurance_per_mile": r.insurance_per_mile,
        "tires_per_mile": r.tires_per_mile,
        "permits_tolls_per_mile": r.permits_tolls_per_mile,
        "other_variable_per_mile": r.other_variable_per_mile,
        "fixed_costs_per_day": r.fixed_costs_per_day,
        "target_miles_per_day": r.target_miles_per_day,
        "mpg": r.mpg,
        "fuel_price_by_region": r.fuel_price_by_region or {},
        "min_margin_percent": r.min_margin_percent,
        "preferred_margin_percent": r.preferred_margin_percent,
        "max_deadhead_miles": r.max_deadhead_miles,
        "block_brokers": r.block_brokers or {},
    }

@app.post("/profiles")
def upsert_profile(payload: ProfileIn, current_user: User = Depends(require_role({"OWNER", "ADMIN"})), db: Session = Depends(get_db)):
    r = (
        db.query(CarrierCostProfile)
        .filter(CarrierCostProfile.tenant_id == current_user.tenant_id, CarrierCostProfile.profile_id == payload.profile_id)
        .first()
    )
    if not r:
        r = CarrierCostProfile(
            tenant_id=current_user.tenant_id,
            profile_id=payload.profile_id,
            display_name=payload.display_name
        )
        db.add(r)

    for k, v in payload.model_dump().items():
        setattr(r, k, v)
    r.updated_at = datetime.utcnow()

    db.commit()
    return {"ok": True, "profile_id": payload.profile_id}

@app.delete("/profiles/{profile_id}")
def delete_profile(profile_id: str, current_user: User = Depends(require_role({"OWNER", "ADMIN"})), db: Session = Depends(get_db)):
    r = (
        db.query(CarrierCostProfile)
        .filter(CarrierCostProfile.tenant_id == current_user.tenant_id, CarrierCostProfile.profile_id == profile_id)
        .first()
    )
    if not r:
        raise HTTPException(status_code=404, detail="Profile not found")
    db.delete(r)
    db.commit()
    return {"ok": True}

# ---- Recommend + logs ----
@app.post("/recommend", response_model=RecommendationOut)
def recommend(req: LoadRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = (
        db.query(CarrierCostProfile)
        .filter(CarrierCostProfile.tenant_id == current_user.tenant_id, CarrierCostProfile.profile_id == req.profile_id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    req_dict = req.model_dump()
    costs = compute_costs(profile, req_dict)
    off = offered_rpm(req_dict)
    be = break_even_rpm(profile, req_dict)
    tgt = target_rpm(profile, req_dict)
    decision, reasons = decision_logic(profile, req_dict)

    revenue = float(req.offered_total_rate)
    profit = revenue - float(costs.total_cost)
    margin = profit / revenue if revenue > 0 else 0.0

    script = negotiation_script(req_dict, be_rpm_value=be, tgt_rpm_value=tgt)

    log = RecommendationLog(
        tenant_id=current_user.tenant_id,
        user_email=current_user.email,
        user_role=current_user.role,
        profile_id=req.profile_id,
        broker_name=req.broker_name,
        origin_city=req.origin_city,
        origin_state=req.origin_state,
        dest_city=req.dest_city,
        dest_state=req.dest_state,
        equipment_type=req.equipment_type,
        loaded_miles=req.loaded_miles,
        deadhead_miles=req.deadhead_miles,
        offered_total_rate=req.offered_total_rate,
        fuel_region=req.fuel_region,
        decision=decision,
        offered_rpm=off,
        break_even_rpm=be,
        target_rpm=tgt,
        projected_profit=profit,
        projected_margin_percent=margin,
        negotiation_script=script,
    )
    db.add(log)
    db.commit()

    return RecommendationOut(
        decision=decision,
        reasons=reasons,
        offered_rpm=off,
        break_even_rpm=be,
        target_rpm=tgt,
        target_total_rate=tgt * float(req.loaded_miles),
        projected_revenue=revenue,
        projected_total_cost=float(costs.total_cost),
        projected_profit=profit,
        projected_margin_percent=margin,
        negotiation_script=script,
    )

@app.get("/logs/recent")
def recent_logs(limit: int = 20, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = (
        db.query(RecommendationLog)
        .filter(RecommendationLog.tenant_id == current_user.tenant_id)
        .order_by(RecommendationLog.created_at.desc())
        .limit(min(limit, 100))
        .all()
    )
    return [{
        "created_at": r.created_at.isoformat(),
        "user": r.user_email,
        "role": r.user_role,
        "profile_id": r.profile_id,
        "broker_name": r.broker_name,
        "lane": f"{r.origin_city},{r.origin_state} → {r.dest_city},{r.dest_state}",
        "offered_total_rate": r.offered_total_rate,
        "offered_rpm": r.offered_rpm,
        "decision": r.decision,
        "projected_profit": r.projected_profit,
        "projected_margin_percent": r.projected_margin_percent,
    } for r in rows]
