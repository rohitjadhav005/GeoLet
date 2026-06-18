from sqlalchemy import create_engine, Column, String, Integer, JSON
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./api/geolet.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Conflict(Base):
    __tablename__ = "conflicts"

    id = Column(String, primary_key=True, index=True)
    country = Column(String, index=True)
    iso = Column(String)
    data = Column(JSON)  # Store the entire conflict payload here for flexible queries

Base.metadata.create_all(bind=engine)
